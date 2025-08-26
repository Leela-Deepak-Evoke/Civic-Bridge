import React, { useEffect } from "react";
import "./AppSnackbar.css";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const AppSnackbar = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto-close after 4s

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <FaCheckCircle className="snackbar-icon success" />,
    warning: <FaExclamationTriangle className="snackbar-icon warning" />,
    error: <FaTimes className="snackbar-icon error" />,
  };

  return (
    <div className={`snackbar snackbar-${type}`}>
      {icons[type]}
      <span className="snackbar-message">{message}</span>
      <button className="snackbar-close" onClick={onClose}>
        x
      </button>
    </div>
  );
};

export default AppSnackbar;
