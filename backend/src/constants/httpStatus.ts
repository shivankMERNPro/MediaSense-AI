// ---------------------------------------------
// Standard HTTP Status Codes and Messages
// ---------------------------------------------

export const HTTP_STATUS = {
  // 1xx — Informational
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,

  // 2xx — Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  PARTIAL_CONTENT: 206,

  // 3xx — Redirection
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  // 4xx — Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,

  // 5xx — Server Errors
  INTERNAL_SERVER: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Type for code values (e.g. 200 | 400 | 500 ...)
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// ---------------------------------------------
// Default Status Messages
// ---------------------------------------------
export const STATUS_MESSAGE: Record<HttpStatusCode, string> = {
  // 1xx
  [HTTP_STATUS.CONTINUE]: "Continue",
  [HTTP_STATUS.SWITCHING_PROTOCOLS]: "Switching protocols",
  [HTTP_STATUS.PROCESSING]: "Processing",

  // 2xx
  [HTTP_STATUS.OK]: "Success",
  [HTTP_STATUS.CREATED]: "Resource created successfully",
  [HTTP_STATUS.ACCEPTED]: "Request accepted for processing",
  [HTTP_STATUS.NO_CONTENT]: "No content",
  [HTTP_STATUS.PARTIAL_CONTENT]: "Partial content delivered",

  // 3xx
  [HTTP_STATUS.MULTIPLE_CHOICES]: "Multiple choices",
  [HTTP_STATUS.MOVED_PERMANENTLY]: "Resource moved permanently",
  [HTTP_STATUS.FOUND]: "Resource found",
  [HTTP_STATUS.NOT_MODIFIED]: "Resource not modified",
  [HTTP_STATUS.TEMPORARY_REDIRECT]: "Temporary redirect",
  [HTTP_STATUS.PERMANENT_REDIRECT]: "Permanent redirect",

  // 4xx
  [HTTP_STATUS.BAD_REQUEST]: "Bad request or validation failed",
  [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized access",
  [HTTP_STATUS.PAYMENT_REQUIRED]: "Payment required",
  [HTTP_STATUS.FORBIDDEN]: "Forbidden - insufficient permissions",
  [HTTP_STATUS.NOT_FOUND]: "Resource not found",
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: "HTTP method not allowed",
  [HTTP_STATUS.NOT_ACCEPTABLE]: "Request not acceptable",
  [HTTP_STATUS.REQUEST_TIMEOUT]: "Request timeout",
  [HTTP_STATUS.CONFLICT]: "Conflict - resource already exists",
  [HTTP_STATUS.GONE]: "Requested resource is no longer available",
  [HTTP_STATUS.LENGTH_REQUIRED]: "Content length required",
  [HTTP_STATUS.PRECONDITION_FAILED]: "Precondition failed",
  [HTTP_STATUS.PAYLOAD_TOO_LARGE]: "Payload too large",
  [HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE]: "Unsupported media type",
  [HTTP_STATUS.TOO_MANY_REQUESTS]: "Too many requests - rate limit exceeded",

  // 5xx
  [HTTP_STATUS.INTERNAL_SERVER]: "Internal server error",
  [HTTP_STATUS.NOT_IMPLEMENTED]: "Not implemented",
  [HTTP_STATUS.BAD_GATEWAY]: "Bad gateway",
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: "Service unavailable",
  [HTTP_STATUS.GATEWAY_TIMEOUT]: "Gateway timeout",
} as const;
