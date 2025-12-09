export interface ApiResponse<T> {
  success?: boolean;
  code: number;
  message?: string;
  data?: T | undefined;
  error?: any | undefined;
  errors?: Array<{ field: string; message: string }> | undefined;
}
