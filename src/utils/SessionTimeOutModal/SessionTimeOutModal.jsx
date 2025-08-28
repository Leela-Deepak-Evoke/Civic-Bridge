import React from "react";
import "./SessionTimeoutModal.css";

const SessionTimeoutModal = ({ onConfirm }) => {
  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <h2>⚠️ Session Expired</h2>
        <p>Your session has been timed out. Please log in again.</p>
        <button className="ok-btn" onClick={onConfirm}>OK</button>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;