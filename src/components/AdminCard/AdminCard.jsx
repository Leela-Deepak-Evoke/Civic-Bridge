import React from "react";
import "./AdminCard.css";

const AdminCard = ({ logo, name, headline, description }) => {
    return (
        <div className="company-card">
            {/* Promoted Badge */}
            <span className="promoted-badge">Govt Official</span>

            {/* Logo + Company Name */}
            <div className="company-header">
                <img src={logo} alt={name} className="company-logo" />
                <div>
                    <h2 className="company-name">{name}</h2>
                    <p className="company-headline">{headline}</p>
                </div>
            </div>

            {/* Description */}
            <p className="company-description">{description}</p>
        </div>
    );
};

export default AdminCard;
