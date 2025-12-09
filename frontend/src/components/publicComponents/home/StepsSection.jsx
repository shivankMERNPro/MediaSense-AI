import Card from "@mui/material/Card";
const StepsSection = () => (
  <Card
    sx={{
      backgroundColor: "#693492",
      border: "1px solid #866f9fff",
      borderRadius: "16px",
      padding: "24px",
      backdropFilter: "blur(10px)",
      textAlign: "left",
      marginTop: "40px",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#7a3fa3",
        border: "1px solid #a080c4",
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(107, 52, 146, 0.4)",
      },
    }}
  >
    <h2 className="text-3xl font-bold text-white text-center mb-8">
      How it works
    </h2>

    <div className="space-y-6">
      {[
        "Upload your media files (images, videos, or documents)",
        "AI analyzes content and generates descriptions, tags, and topics",
        "Search using natural language or filter by type and tags",
        "View, download, and manage your media library",
      ].map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="bg-pink-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-lg font-bold">
            {index + 1}
          </div>
          <p className="text-purple-200 text-lg">{step}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default StepsSection;
