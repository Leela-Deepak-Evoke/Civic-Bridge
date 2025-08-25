import React, { useEffect, useState } from 'react'
import { FaTachometerAlt } from 'react-icons/fa';
import './StatusDashboard.css';
import axiosInstance from '../../api/axiosInstance';

const StatusDashboard = ({ concerns }) => {
    const parsedData = localStorage.getItem('UserData');
    const statuses = ["Pending", "Ongoing", "Resolved"];
    // ✅ count concerns by status
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
                console.log("Error: ", error);
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
        </div>
    );
};

export default StatusDashboard;
