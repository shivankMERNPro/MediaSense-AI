declare module "pdf-parse" {
  type PdfParseResult = {
    text?: string;
    numpages?: number;
    info?: Record<string, unknown>;
  };

  const pdfParse: (dataBuffer: Buffer) => Promise<PdfParseResult>;
  export default pdfParse;
}

declare module "mammoth" {
  type ExtractResult = {
    value?: string;
    messages?: Array<{ type: string; message: string }>;
  };

  export function extractRawText(options: { buffer: Buffer }): Promise<ExtractResult>;
}

declare module "tmp" {
  type FileCallback = (
    err: Error | null,
    path: string,
    fd: number,
    cleanupCallback: () => void
  ) => void;

  export function file(
    options: { postfix?: string; discardDescriptor?: boolean },
    callback: FileCallback
  ): void;
}

declare module "fluent-ffmpeg" {
  import { EventEmitter } from "events";

  interface ScreenshotOptions {
    timestamps: Array<string | number>;
    filename?: string;
    folder?: string;
    size?: string;
  }

  interface FfmpegCommand extends EventEmitter {
    screenshots(options: ScreenshotOptions): FfmpegCommand;
    on(event: "end", handler: () => void): FfmpegCommand;
    on(event: "error", handler: (error: Error) => void): FfmpegCommand;
  }

  function ffmpeg(input?: string): FfmpegCommand;

  export default ffmpeg;
}

