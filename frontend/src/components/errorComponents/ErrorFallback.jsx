import React from "react";
import PropTypes from "prop-types";
import "../../assets/styles/errorHandlerComStyles/errorFallback.css";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback-container">
      <div className="error-fallback-content">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title">Something went wrong.</h1>
        <p className="error-message">
          {error?.message ||
            "An unexpected error occurred. Please try refreshing the page."}
        </p>
        <button className="error-button" onClick={resetErrorBoundary}>
          Refresh Page
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;
