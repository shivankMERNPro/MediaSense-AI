import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

import { env } from '../constants/env';
import { logger } from '../utils/logger';

// ----------------------------------------------------------------------
// Interface: Standard Validation Error Response Format
// ----------------------------------------------------------------------
interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

// ----------------------------------------------------------------------
// Extend Express Request Type to Include Validated Data
// ----------------------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      validatedData?: unknown;
    }
  }
}

// ----------------------------------------------------------------------
// Helper: Extract Data to Validate Based on HTTP Method
// ----------------------------------------------------------------------
function prepareValidationData(req: Request): Record<string, any> {
  const method = req.method.toUpperCase();

  switch (method) {
    case 'GET':
      return req.query;
    case 'POST':
      return req.body;
    case 'PUT':
    case 'PATCH':
      return { ...req.body, ...req.params };
    case 'DELETE':
      return req.params;
    default:
      return {};
  }
}

// ----------------------------------------------------------------------
// Type Guards for Error Handling
// ----------------------------------------------------------------------
function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

function isErrorWithMessage(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// ----------------------------------------------------------------------
// Middleware: Validate Request Using Zod Schema
// ----------------------------------------------------------------------
export const validateRequest = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dataToValidate = prepareValidationData(req);
      const validatedData = await schema.parseAsync(dataToValidate);
      req.validatedData = validatedData;

      
      next();
    } catch (error: unknown) {
      // -------------------------------
      // Case 1: Zod Validation Error
      // -------------------------------
      if (isZodError(error)) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        if (env.nodeEnv === 'development') {
          // Use stringified object for single-argument logger
          logger.error(
            `Validation Error: ${JSON.stringify(formattedErrors, null, 2)}`,
          );
        }

        const errorResponse: ValidationErrorResponse = {
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        };

        res.status(400).json(errorResponse);
        return;
      }

      // -------------------------------
      // Case 2: Standard JavaScript Error
      // -------------------------------
      if (isErrorWithMessage(error)) {
        logger.error(`Validation Middleware Error: ${error.message}`);
        res.status(500).json({
          success: false,
          message: error.message || 'Internal server error',
        });
        return;
      }

      // -------------------------------
      // Case 3: Unknown or Unexpected Error
      // -------------------------------
      logger.error(
        `Unexpected non-standard error in validation middleware: ${JSON.stringify(error)}`,
      );
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred during validation.',
      });
    }
  };
};
