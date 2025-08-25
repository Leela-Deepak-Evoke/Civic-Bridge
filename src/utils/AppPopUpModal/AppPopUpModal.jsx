import React from "react";
import "./AppPopUpModal.css";

const AppPopUpModal = ({ heading, isOpen, onClose, onConfirm, confirmText = "OK", cancelText = "Cancel", children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className={`popup-container ${heading === "My Concerns" ? "centered" : ""}`}>
                {/* Header */}
                <div className="popup-header">
                    <h2 className="popup-title">{heading}</h2>
                </div>

                {/* Content injected */}
                <div className="popup-content">{children}</div>

                {/* Footer actions */}
                <div className="popup-actions">
                    {onConfirm && (
                        <button className="btn-confirm" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    )}
                    <button className="btn-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppPopUpModal;
