import React, { useState, useEffect } from "react";
import {
    FaMapMarkerAlt,
    FaRegClock,
    FaUserCircle,
    FaCommentDots,
    FaRegComment,
    FaPaperPlane,
} from "react-icons/fa";
import "./ConcernCard.css";
import axiosInstance from "../../api/axiosInstance";
import AppSnackbar from "../../utils/AppSnackbar/AppSnackbar";

const IssueCard = ({ data, isMyConcern }) => {
    const [showComments, setShowComments] = useState(false);
    const [addingComment, setAddingComment] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(data.comments || []);

    const [appsnackbar, setAppSnackbar] = useState(null);

    const showSnackbar = (msg, type) => {
        setAppSnackbar({ msg, type });
    };

    // Sync comments whenever the data changes (new concern added)
    useEffect(() => {
        setComments(data.comments || []);
    }, [data]);

    const [user] = useState(() => {
        const stored = localStorage.getItem("UserData");
        return stored ? JSON.parse(stored) : null;
    });

    const statusClassMap = {
        Pending: "pending",
        Ongoing: "ongoing",
        Resolved: "resolved",
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        const stored = localStorage.getItem("UserData");
        const userID = JSON.parse(stored).id;

        try {
            const payload = {
                userId: userID,
                comment: newComment,
            };

            const token = user?.idToken;
            const res = await axiosInstance.post(
                `/issues/${data._id}/comments`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data != null) {
                showSnackbar("Comment Posted sucessfully!", "success");
            }

            const savedComment = res.data.data.at(-1);

            setComments((prev) => [
                ...prev,
                {
                    ...savedComment,
                    createdAt: savedComment.createdAt || new Date().toISOString(),
                },
            ]);

            setNewComment("");
            setAddingComment(false);
            setShowComments(true);
        } catch (error) {
            const message =
                error.response?.data?.message || // backend error message
                error.message ||                 // axios message (e.g., "Request failed with status code 401")
                "Something went wrong";          // fallback
            showSnackbar(message, "error");
        }
    };

    return (
        <div className="issue-card">
            {/* Image */}
            <div className="issue-img">
                <img src={data.imageUrl} alt={data.title} />
                <span className={`status-badge ${statusClassMap[data.status] || ""}`}>
                    {data.status}
                </span>
            </div>

            {/* Content */}
            <div className="issue-content">
                <p className="issue-desc">{data.description}</p>

                <div className="issue-meta">
                    <span>
                        <FaRegClock /> {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                        <FaMapMarkerAlt /> {data.location}
                    </span>
                </div>

                <div className="issue-reported">
                    <FaUserCircle className="user-icon" />
                    Reported :{" "}
                    {data.reportedBy?.name
                        ? data.reportedBy.name.charAt(0).toUpperCase() +
                        data.reportedBy.name.slice(1)
                        : ""}
                </div>

                {/* Comments Section */}
                <div className="issue-comments">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {!isMyConcern && (
                            <button onClick={() => setAddingComment(!addingComment)}>
                                <FaRegComment /> Add Comment
                            </button>
                        )}

                        <button onClick={() => setShowComments(!showComments)}>
                            <FaCommentDots /> {comments.length}
                        </button>
                    </div>

                    {/* Show Comments */}
                    {showComments && (
                        <div className="comments-list">
                            {comments.map((c, index) => (
                                <div key={c._id || index} className="comment-item">
                                    <div className="comment-avatar">
                                        <FaUserCircle />
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-bubble">
                                            <p className="comment-text">{c.comment}</p>
                                        </div>
                                        <small className="comment-time">
                                            {c.createdAt
                                                ? new Date(c.createdAt).toLocaleString()
                                                : "Just now"}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* Add Comment Input */}
                    {addingComment && (
                        <div className="add-comment-box">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <button className="send-btn" onClick={handleSendComment}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    )}
                </div>
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

export default IssueCard;
