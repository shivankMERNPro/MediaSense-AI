import React from "react";
import "../../assets/styles/commonComponentStyles/Loader.css";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="hourglass-overlay">
      <div className="hourglass-box">
        <div className="hourglass-spin">⏳</div>
        <p className="hourglass-text">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
