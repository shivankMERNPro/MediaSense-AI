import { Response } from "express";
import { ApiResponse } from "../types/apiResponse.type";
import { STATUS_MESSAGE } from "../constants/httpStatus";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload?: ApiResponse<T> | string | T
): Response => {
  // If payload is already an ApiResponse object
  if (payload && typeof payload === "object" && "code" in payload) {
    const success =
      typeof payload.success === "boolean"
        ? payload.success
        : statusCode >= 200 && statusCode < 300;

    const message =
      payload.message ||
      STATUS_MESSAGE[statusCode as keyof typeof STATUS_MESSAGE] ||
      (success ? "Success" : "Error");

    const response: ApiResponse<T> = {
      success,                  // 1️⃣ success first
      code: statusCode,         // 2️⃣ code
      message,                  // 3️⃣ message
      error: payload.error,     // 4️⃣ error
      data: payload.data,       // 5️⃣ data
      errors: payload.errors,   // 6️⃣ validation errors
    };

    return res.status(statusCode).json(response);
  }

  const isSuccess = statusCode >= 200 && statusCode < 300;

  const statusMessage =
    STATUS_MESSAGE[statusCode as keyof typeof STATUS_MESSAGE] ||
    (isSuccess ? "Success" : "Error");

  const response: ApiResponse<T> = {
    success: isSuccess,                             // 1️⃣ success first
    code: statusCode,                               // 2️⃣ code
    message:
      typeof payload === "string" ? payload : statusMessage, // 3️⃣ message
    error: !isSuccess && typeof payload === "string" ? payload : undefined, // 4️⃣ error
    data: isSuccess && typeof payload !== "string" ? (payload as T) : undefined, // 5️⃣ data
  };

  return res.status(statusCode).json(response);
};
