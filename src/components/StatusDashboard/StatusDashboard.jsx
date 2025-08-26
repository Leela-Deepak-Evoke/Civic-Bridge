import React, { useEffect, useState } from 'react'
import { FaTachometerAlt } from 'react-icons/fa';
import './StatusDashboard.css';
import axiosInstance from '../../api/axiosInstance';
import AppSnackbar from "../../utils/AppSnackbar/AppSnackbar";


const StatusDashboard = ({ concerns }) => {
    const parsedData = localStorage.getItem('UserData');
    const statuses = ["Pending", "Ongoing", "Resolved"];

    const [appsnackbar, setAppSnackbar] = useState(null);

    const showSnackbar = (msg, type) => {
        setAppSnackbar({ msg, type });
    };

    const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = concerns.filter(c => c.status === status).length;
        return acc;
    }, {});

    useEffect(() => {
        const { idToken } = JSON.parse(parsedData);
        const authHeaders = { Authorization: `Bearer ${idToken}` };

        const fetchStatuses = async () => {
            try {
                const statusResponses = await Promise.all(
                    statuses.map((status) =>
                        axiosInstance.get(`/issues/status/${status}`, { headers: authHeaders })
                    )
                );

                const statusCountsObj = {};
                statuses.forEach((status, index) => {
                    statusCountsObj[status] = statusResponses[index].data.data.length;
                });
            } catch (error) {
                const message =
                    error.response?.data?.message || // backend error message
                    error.message ||                 // axios message (e.g., "Request failed with status code 401")
                    "Something went wrong";          // fallback
                showSnackbar(message, "error");
            }
        };

        fetchStatuses();
    }, [parsedData]);

    // ✅ FIXED: Map over statuses, not statusCounts
    const statusData = statuses.map((status) => ({
        status,
        count: statusCounts[status] || 0
    }));

    return (
        <div className='status-card'>
            <FaTachometerAlt className='status-icon' />
            <h2 className='dashboardHead'>Concerns Dashboard</h2>
            <p className="viewStatus">Status Wise Count</p>
            <div className="chip-container" style={{ marginTop: '10px' }}>
                {statusData.map((row, index) => (
                    <div className="chip" key={index}>
                        <span className="location">{row.status}</span>
                        <span className="concerns">{row.count}</span>
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

export default StatusDashboard;
