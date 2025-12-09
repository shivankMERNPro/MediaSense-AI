import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/errorComponentStyles/notFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="nf-container">
      <div className="nf-left">
        <h1 className="nf-code">404</h1>
        <h3 className="nf-title">Hmmm...</h3>
        <p className="nf-subtitle">
          It looks like one of the developers fell asleep
        </p>
        <div className="nf-buttons">
          <button
            className="nf-btn nf-login"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
          <button className="nf-btn nf-contact" onClick={() => navigate(-1)}>
            Previous Page
          </button>
        </div>
      </div>

      <div className="nf-right">
        <div className="moon"></div>
        <div className="astronaut">
          <div className="helmet"></div>
          <div className="body"></div>
          <div className="arms"></div>
          <div className="legs"></div>
          <div className="cable"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
