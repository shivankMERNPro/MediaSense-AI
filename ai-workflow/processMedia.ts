// ------------------------------------------------------
// aiWorkflow.ts — CLEAN + FIXED + FULL VERSION
// ------------------------------------------------------

import { GoogleGenAI, createPartFromUri, createUserContent } from "@google/genai";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// ------------------------------------------------------
// 1. GOOGLE GENAI CLIENT
// ------------------------------------------------------
const ai = new GoogleGenAI({
  apiKey: "AIzaSyD7gRgo8qiyNyC6GuHBtC-7aqW8rJoLi08",
});

// ------------------------------------------------------
// 2. LOAD MEDIA MODEL (TS in dev / JS in prod)
// ------------------------------------------------------
let Media: any = null;

export const loadMediaModel = async () => {
  if (Media) return Media;

  // ----------------------------
  // 1️⃣ TRY LOADING TS (DEV MODE)
  // ----------------------------
  try {
    const tsModule: any = await import(
      "../backend/src/models/media.model.ts"
    );
    Media = tsModule.Media || tsModule.default;

    if (Media) {
      console.log("✅ Loaded Media model (TypeScript Mode)");
      return Media;
    }
  } catch (err) {
    console.log("ℹ️ TS model not found, trying JS build...");
  }

  // ----------------------------
  // 2️⃣ TRY LOADING JS (PRODUCTION BUILD)
  // ----------------------------
  try {
    const jsModule: any = await import(
      "../backend/dist/models/media.model.js"
    );
    Media = jsModule.Media || jsModule.default;

    if (Media) {
      console.log("✅ Loaded Media model (JavaScript Mode)");
      return Media;
    }
  } catch (err) {
    console.error("❌ Media model not found in TS or JS build");
    throw err;
  }
};

// ------------------------------------------------------
// 3. CONNECT MONGO
// ------------------------------------------------------
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("❌ Missing MONGO_URI");

  await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME });
  await loadMediaModel();
};

// ------------------------------------------------------
// 4. EMBEDDING GENERATION
// ------------------------------------------------------
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response: any = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,   // <-- MUST be a string, NOT an object or array
    });

    console.log("🔍 Embedding response:", response);

    return response?.embeddings?.[0]?.values || [];
  } catch (err) {
    console.error("❌ Embedding failed:", err);
    return [];
  }
}



function normalize(vec: number[]) {
  const mag = Math.sqrt(vec.reduce((a, b) => a + b * b, 0));
  return vec.map((v) => v / (mag || 1));
}

function cosine(A: number[], B: number[]) {
  if (!A.length || !B.length) return 0;
  if (A.length !== B.length) return 0;

  const na = normalize(A);
  const nb = normalize(B);

  let dot = 0;
  for (let i = 0; i < na.length; i++) dot += na[i] * nb[i];
  return dot;
}

function toNumArray(raw: any[]): number[] {
  return raw.map((v) => Number(v)).filter((n) => !isNaN(n));
}

// ------------------------------------------------------
// 5. SEMANTIC SEARCH — FIND SIMILAR MEDIA
// ------------------------------------------------------
// Assuming toNumArray and cosine are defined elsewhere.
export async function findSimilarMedia(
  userId: string,
  queryEmbedding: number[],
  queryText: string | any,
  limit = 20
) {
  await connectDB();
  const Media = await loadMediaModel();

  // Fetch all media for user (you can reduce this later if needed)
  const allMedia = await Media.find({
    userId,
    status: "ready"
  }).lean();

  // Normalize user embedding
  const queryVec = toNumArray(queryEmbedding);
// SAFETY FIX: Ensure queryText is always a valid string
const safeQueryText =
  typeof queryText === "string"
    ? queryText
    : queryText?.text || queryText?.query || JSON.stringify(queryText) || "";

// Prepare keyword tokens
const tokens = safeQueryText
  .toLowerCase()
  .split(/\s+/)
  .filter(Boolean);


  const scored = allMedia
    .map((item) => {
      const vec = toNumArray(item.embedding);
      let semanticScore = 0;
      let keywordScore = 0;

      // ================================
      // 1. SEMANTIC SCORE (cosine)
      // ================================
      if (vec.length > 0 && vec.length === queryVec.length) {
        semanticScore = cosine(queryVec, vec);
      }

      // ================================
      // 2. KEYWORD SCORE (Google-style)
      // ================================
      const text =
        `${item.description || ""} ${item.originalName || ""} ${item.tags?.join(" ") || ""}`
          .toLowerCase();

      let hits = 0;
      tokens.forEach((t) => {
        if (text.includes(t)) hits += 1;
      });

      if (hits > 0) {
        keywordScore = hits / tokens.length; // normalize 0–1
      }

      // ================================
      // 3. RECENCY BOOST
      // ================================
      const created = new Date(item.createdAt).getTime();
      const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.exp(-ageDays / 90); // 0–1 decay

      // ================================
      // 4. FINAL SCORE CALCULATION
      // (similar to Google-style hybrid ranking)
      // ================================
      const finalScore =
        semanticScore * 0.55 +
        keywordScore * 0.30 +
        recencyScore * 0.15;

      return {
        ...item,
        semanticScore,
        keywordScore,
        recencyScore,
        finalScore,
      };
    })
    .filter((x) => x.finalScore > 0.10) // LOW threshold (critical fix)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);

  return scored;
}


// ------------------------------------------------------
// 6. PDF UPLOAD FOR AI
// ------------------------------------------------------
export async function uploadPDFToGemini(filePath: string, displayName: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

  const uploaded = await ai.files.upload({
    file: fileBlob,
    config: { displayName },
  });

  let fileInfo = await ai.files.get({ name: uploaded.name! });

  while (fileInfo.state === "PROCESSING") {
    console.log(`⏳ PDF processing... state=${fileInfo.state}`);
    await new Promise((r) => setTimeout(r, 5000));
    fileInfo = await ai.files.get({ name: uploaded.name! });
  }

  if (fileInfo.state === "FAILED") throw new Error("❌ PDF processing failed");

  return fileInfo;
}


// ------------------------------------------------------
// 7. DESCRIPTION GENERATION
// ------------------------------------------------------
export async function generateDescription(
  filePath: string,
  fileType: "document" | "image" | "video"
) {
  try {
    if (fileType === "document" && filePath.endsWith(".pdf")) {
      const uploaded = await uploadPDFToGemini(filePath, "Uploaded PDF");

      const pdfPart = createPartFromUri(uploaded.uri!, uploaded.mimeType!);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          "Summarize this PDF in 1–2 sentences.",
          pdfPart,
        ],
      });

      return response.text || "No description generated";
    } 
    
    if (fileType === "image") {
      const base64 = fs.readFileSync(filePath, {
        encoding: "base64",
      })

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64,
            },
          },
          { text: "Describe this image in 1 sentence." },
        ],
      });

      return response.text || "No description generated";
    }
    
    
    // --- Video Handling (Corrected) ---
    if (fileType === "video") {      
      const uploadedFile = await ai.files.upload({
        file: filePath, 
        config: { mimeType: "video/mp4" },
      });

      const videoPart = createPartFromUri(uploadedFile.uri!, uploadedFile.mimeType!);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // Assuming 'createUserContent' correctly formats the request
        contents: createUserContent([
          videoPart,
          "Summarize this video in 1 or 2 sentences.",
        ]),
      });

      // 4. Clean up the uploaded file after use (Recommended for video)
      // await ai.files.delete({ name: uploadedFile.name! });
      
      return response.text || "Failed to generated description";
    }


    return "Media type not supported or recognized";
  } catch (err: any) {
    console.error("❌ Description generation failed:", err);
    throw new Error(err.message); // ✅ THROW ERROR
  }
}

// ------------------------------------------------------
// 8. TAGS
// ------------------------------------------------------
export async function generateTags(description: string) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "Extract 5–8 short lowercase tags. Return ONLY {\"tags\":[]}.",
        description,
      ],
      config: { responseMimeType: "application/json" },
    });

    if (!result.text) return [];

    const json = JSON.parse(result.text);
    return json.tags || [];
  } catch {
    return ["N/A"];
  }
}

// ------------------------------------------------------
// 9. TOPICS
// ------------------------------------------------------
export async function generateTopics(description: string, tags: string[]) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "Generate 1–3 broad topics. Return ONLY {\"topics\":[]}.",
        `Description: ${description}`,
        `Tags: ${tags.join(", ")}`,
      ],
      config: { responseMimeType: "application/json" },
    });

    if (!result.text) return [];

    const json = JSON.parse(result.text);
    return json.topics || [];
  } catch {
    return ["N/A"];
  }
}

// ------------------------------------------------------
// 10. PROCESS MEDIA (MAIN PIPELINE)
// ------------------------------------------------------
export async function processMediaWithAI(
  mediaId: string,
  filePath: string,
  fileType: "image" | "video" | "document"
) {
  try {
    await connectDB();
    await Media.findByIdAndUpdate(mediaId, { status: "analyzing" });

    const description = await generateDescription(filePath, fileType);
    const tags = await generateTags(description);
    const topics = await generateTopics(description, tags);

    const embeddingInput = `${description} ${tags.join(" ")} ${topics.join(" ")}`;
    const embedding: any = await generateEmbedding(embeddingInput);

    await Media.findByIdAndUpdate(mediaId, {
      description,
      tags,
      topics,
      embedding,
      status: "ready",
      analyzedAt: new Date(),
    });

    console.log(`✅ AI processing complete for ${mediaId}`);
  } catch (err: any) {
    console.error("❌ AI processing failed:", err);

    // await Media.findByIdAndUpdate(mediaId, {
    //   status: "error",
    //   processingError: err.message,
    // });


    await Media.findByIdAndUpdate(mediaId, {
      description:"Failed to generate description, Tags & Topics",
      tags:["N/A"],
      topics: ["N/A"],
      embedding:[],
      status: "error",
      processingError: err.message,
    });
  }
}

// ------------------------------------------------------
// EXPORT
// ------------------------------------------------------
export default {
  processMediaWithAI,
  findSimilarMedia,
  generateEmbedding,
  generateDescription,
  generateTags,
  generateTopics,
};
