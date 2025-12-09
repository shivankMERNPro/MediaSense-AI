import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import reloadWindow from "../../utils/reloadWindow";
import ErrorFallback from "./ErrorFallback";

/**
 * Functional ErrorBoundary
 * - Catches errors in child components
 * - Logs errors to console
 * - Shows fallback UI
 * - Allows reset using reloadWindow
 */
const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={reloadWindow}
      onError={(error, info) => {
        console.error("ErrorBoundary caught:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
