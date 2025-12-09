/**
 * Simple API Logger Utility
 * ----------------------------------------
 * ✅ Logs requests, responses, and errors clearly in development mode
 * 🚫 Automatically silenced in production
 * 🧩 Used inside baseQueryWithInterceptor and other utilities
 */

import env from "../consts/env";

export const apiLogger = (type, data, color = "#00bcd4") => {
  //---------------------------------------
  // Only log in development mode
  //---------------------------------------
  if (env.mode !== "development") return;

  const styles = `
    background: ${color};
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
  `;

  const timestamp = new Date().toLocaleTimeString();

  if (type === "Request") {
    console.groupCollapsed(`%c[API REQUEST - ${timestamp}]`, styles);
    console.log("Type:", type);
    console.log("Payload:", data);
    console.groupEnd();
  } else if (type === "Response") {
    console.groupCollapsed(`%c[API RESPONSE - ${timestamp}]`, styles);
    console.log("Data:", data);
    console.groupEnd();
  } else if (type === "API Error") {
    console.groupCollapsed(
      `%c[API ERROR - ${timestamp}]`,
      "background: #f44336; color: white; padding: 2px 6px; border-radius: 4px;",
    );
    console.error("Error:", data);
    console.groupEnd();
  } else if (type === "Unexpected Error") {
    console.groupCollapsed(
      `%c[UNEXPECTED ERROR - ${timestamp}]`,
      "background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px;",
    );
    console.error("Exception:", data);
    console.groupEnd();
  } else {
    console.groupCollapsed(`%c[API LOG - ${timestamp}]`, styles);
    console.log("Info:", { type, data });
    console.groupEnd();
  }
};
