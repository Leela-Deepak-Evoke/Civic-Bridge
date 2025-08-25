import React, { useState, useEffect } from "react";
import CivicBrandLogo from '../../assets/CivicBridgeRectLogo.png';
import {
    FaSearch, FaClipboardList, FaClock, FaCheckCircle, FaSpinner,
    FaChevronDown, FaUserCircle,
} from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { MdPublic } from "react-icons/md";
import "./HeaderLayout.css";
import { useAuth } from "../../context/AuthContext";
import MyConcernModal from "../../utils/MyConcernsModal/MyConcerns";
import UploadConcernModal from "../../utils/UploadConernModal/UploadConcern";
import { useNavigate } from "react-router-dom";

const HeaderLayout = ({ selectedCity, selectedStatus, onSelectStatus, onSearch, onConcernAdded }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const statuses = [
        { label: "Pending", icon: <FaClock /> },
        { label: "Ongoing", icon: <FaSpinner /> },
        { label: "Resolved", icon: <FaCheckCircle /> }
    ];

    const [openStatus, setOpenStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMainBtn, setSelectedMainBtn] = useState("All Concerns");

    const handleSelectStatus = (statusObj) => {
        setSelectedMainBtn("All Concerns");
        setOpenStatus(false);
        if (onSelectStatus) onSelectStatus(statusObj.label);
    };

    const handleUploadConcernClick = () => {
        setSelectedMainBtn("Upload Concern");
        setOpen(true);
        if (onSelectStatus) onSelectStatus(null);
        setSelectedMainBtn("All Concerns");
    };

    const handleMyConcernsClick = () => {
        setSelectedMainBtn("My Concerns");
        setIsPopupOpen(true);
        if (onSelectStatus) onSelectStatus(null);
    };

    const handleAllConcernsClick = () => {
        setSelectedMainBtn("All Concerns");
        if (onSelectStatus) onSelectStatus(null);
    };

    const isStatusSelected = !!selectedStatus;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1124);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 768);
    const [fabOpen, setFabOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1124); // tablet + mobile
            setIsSmallMobile(window.innerWidth < 768); // only small mobile
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const parsedData = localStorage.getItem("UserData");
    const userId = parsedData ? JSON.parse(parsedData).id : null;

    return (
        <header style={{
            background: "white",
            padding: '0px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000
        }}>
            <div className="leftNav">
                <img src={CivicBrandLogo} alt="" className="brandLogo" onClick={() => navigate(0)} />
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Search issues..." onChange={(e) => onSearch(e.target.value)} />
                </div>
            </div>

            {/* Desktop / Tablet Right Nav */}
            {!isMobile &&
                <div className="rightNav">
                    <div
                        className="icon-btn"
                        style={{
                            background: selectedMainBtn === "All Concerns" ? "#0f2027" : "",
                            color: selectedMainBtn === "All Concerns" ? "white" : ""
                        }}
                        onClick={handleAllConcernsClick}
                    >
                        <MdPublic className='issues-icon' />
                        {selectedCity ? `Concerns in ${selectedCity}` : "All Concerns"}
                    </div>

                    <div
                        className="icon-btn custom-dropdown-wrapper"
                        style={{
                            background: isStatusSelected ? "#0f2027" : "",
                            color: isStatusSelected ? "white" : ""
                        }}
                        onClick={() => setOpenStatus(!openStatus)}
                    >
                        <span className="selected-option">
                            <span className="dropdown-icon">
                                {statuses.find(s => s.label === selectedStatus)?.icon || <FaClock />}
                            </span>
                            <p>{selectedStatus || "Pending"}</p>
                        </span>
                        <FaChevronDown className={`dropdown-arrow ${openStatus ? "open" : ""}`} />
                        {openStatus && (
                            <div className="dropdown-menu">
                                {statuses.map((item) => (
                                    <div
                                        key={item.label}
                                        className="dropdown-item"
                                        onClick={() => handleSelectStatus(item)}
                                    >
                                        <span className="dropdown-icon">{item.icon}</span>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        className="icon-btn"
                        style={{
                            background: selectedMainBtn === "My Concerns" ? "#0f2027" : "",
                            color: selectedMainBtn === "My Concerns" ? "white" : ""
                        }}
                        onClick={handleMyConcernsClick}
                    >
                        <FaClipboardList className='issues-icon' />
                        My Concerns
                    </div>

                    <div
                        className="icon-btn"
                        style={{
                            background: selectedMainBtn === "Upload Concern" ? "#0f2027" : "",
                            color: selectedMainBtn === "Upload Concern" ? "white" : ""
                        }}
                        onClick={handleUploadConcernClick}
                    >
                        <FiUploadCloud className='issues-icon' />
                        Upload Concern
                    </div>
                </div>
            }

            {/* Mobile FAB */}
            {isMobile && (
                <div className="fab-container">
                    <button
                        className={`fab-button ${fabOpen ? "open" : ""}`}
                        onClick={() => setFabOpen(!fabOpen)}
                    >
                        +
                    </button>

                    {fabOpen && (
                        <div className="fab-menu">
                            <div
                                className="fab-item"
                                style={{
                                    background: selectedMainBtn === "All Concerns" ? "#0f2027" : "",
                                    color: selectedMainBtn === "All Concerns" ? "white" : ""
                                }}
                                onClick={() => {
                                    handleAllConcernsClick();
                                    setFabOpen(false);
                                }}
                            >
                                <MdPublic /> All Concerns
                            </div>

                            <div
                                className="fab-item"
                                style={{
                                    background: selectedMainBtn === "Upload Concern" ? "#0f2027" : "",
                                    color: selectedMainBtn === "Upload Concern" ? "white" : ""
                                }}
                                onClick={() => {
                                    handleUploadConcernClick();
                                    setFabOpen(false);
                                }}
                            >
                                <FiUploadCloud /> Upload Concern
                            </div>

                            {/* Logout only on small mobile */}
                            {isSmallMobile && (
                                <div
                                    className="fab-item"
                                    onClick={async () => {
                                        try {
                                            await logout();
                                            navigate("/login", { replace: true });
                                        } catch (error) {
                                            console.log("Error: ", error);
                                        }
                                        setFabOpen(false);
                                    }}
                                >
                                    <FaUserCircle /> Logout
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <MyConcernModal
                heading={"My Concerns"}
                isOpen={isPopupOpen}
                onClose={() => {
                    setSelectedMainBtn("All Concerns");
                    setIsPopupOpen(false);
                }}
                onConfirm={() => {
                    alert("Confirmed!");
                    setSelectedMainBtn("All Concerns");
                    setIsPopupOpen(false);
                }}
            />

            <UploadConcernModal
                isOpen={open}
                onClose={() => setOpen(false)}
                userId={userId}
                onConcernAdded={onConcernAdded}
            />
        </header>
    );
};

export default HeaderLayout;
