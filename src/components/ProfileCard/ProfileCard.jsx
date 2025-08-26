import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import AppSnackbar from "../../utils/AppSnackbar/AppSnackbar";

const ProfileCard = ({ username, role, onSelectLocation, concerns }) => {

    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const parsedData = localStorage.getItem('UserData');

    const [appsnackbar, setAppSnackbar] = useState(null);

    const showSnackbar = (msg, type) => {
        setAppSnackbar({ msg, type });
    };


    const handleSelect = (location) => {
        setSelectedLocation(location);
        onSelectLocation(location);
    };

    const cities = ["Mumbai", "Chennai", "Bangalore", "Delhi", "Hyderabad"];
    const cityCounts = cities.reduce((acc, city) => {
        acc[city] = concerns.filter(c => c.location === city).length;
        return acc;
    }, {});

    useEffect(() => {
        const { idToken } = JSON.parse(parsedData);
        const authHeaders = { Authorization: `Bearer ${idToken}` };

        const fetchConcerns = async () => {
            try {
                // ✅ Fetch by city
                const responses = await Promise.all(
                    cities.map((city) =>
                        axiosInstance.get(`/issues/location/${city}`, { headers: authHeaders })
                    )
                );

                const cityCountsObj = {};
                cities.forEach((city, index) => {
                    cityCountsObj[city] = responses[index].data.data.length;
                });

            } catch (error) {
                const message =
                    error.response?.data?.message || // backend error message
                    error.message ||                 // axios message (e.g., "Request failed with status code 401")
                    "Something went wrong";          // fallback
                showSnackbar(message, "error");
            }
        };

        fetchConcerns();
    }, [parsedData]);


    const tableData = cities.map((city) => ({
        location: city,
        concerns: cityCounts[city] || 0,
    }));

    const handleLogout = async () => {
        try {
            await logout();
            showSnackbar("Logout successful!", "success");
            navigate("/login", { replace: true });
        } catch (error) {
            const message =
                error.response?.data?.message || // backend error message
                error.message ||                 // axios message (e.g., "Request failed with status code 401")
                "Something went wrong";          // fallback
            showSnackbar(message, "error");
        }
    };

    return (
        <div className="profile-card">
            <FaUserCircle className="profile-icon" />
            <h2 className="profile-name">{username}</h2>
            <p className="profile-role">{role}</p>
            <div className="button-group">
                <button className="action-btn logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="btn-icon" />
                    Logout
                </button>
            </div>
            <h3 className="chipsHead">View All Concerns By Location</h3>
            <div className="chip-container">
                {tableData.map((row, index) => (
                    <div
                        className={`chip ${selectedLocation === row.location ? "selected" : ""}`}
                        key={index}
                        onClick={() => handleSelect(row.location)}
                    >
                        <span className="location">{row.location}</span>
                        <span className="concerns">{row.concerns}</span>
                    </div>
                ))}
            </div>
            {appsnackbar && (
                <AppSnackbar
                    message={appsnackbar.msg}
                    type={appsnackbar.type}
                    onClose={() => setAppSnackbar(null)}
                />
            )}
        </div>
    );
};

export default ProfileCard;
