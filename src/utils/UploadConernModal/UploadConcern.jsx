import React, { useState, useEffect } from "react";
import AppPopUpModal from "../AppPopUpModal/AppPopUpModal";
import "./UploadConcern.css";
import axiosInstance from "../../api/axiosInstance";
import AppSnackbar from "../../utils/AppSnackbar/AppSnackbar";

const UploadConcernModal = ({ isOpen, onClose, userId, onConcernAdded }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("Hyderabad");
    const [imageUrl, setImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [appsnackbar, setAppSnackbar] = useState(null);

    const showSnackbar = (msg, type) => {
        setAppSnackbar({ msg, type });
    };

    const locationOptions = ["Hyderabad", "Mumbai", "Delhi", "Bangalore", "Chennai"];

    const handleImageChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setPreviewUrl(url);
    };

    const [user] = useState(() => {
        const stored = localStorage.getItem("UserData");
        return stored ? JSON.parse(stored) : null;
    });

    // ✅ Reset form whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setDescription("");
            setLocation("Hyderabad");
            setImageUrl("");
            setPreviewUrl("");
            setErrors({});
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const newErrors = {};

        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return; // stop submission

        const payload = {
            title,
            description,
            location,
            imageUrl,
            userId,
            status: "Pending",
            flags: {
                isCritical: false,
                isDuplicate: false,
                notes: "",
            },
        };

        try {
            const token = user?.idToken;
            const res = await axiosInstance.post("/issues", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (onConcernAdded) {
                onConcernAdded(res.data.data); // ✅ update parent state immediately
            }

            // ✅ Reset form on successful submit
            setTitle("");
            setDescription("");
            setLocation("Hyderabad");
            setImageUrl("");
            setPreviewUrl("");
            setErrors({});
            onClose(); // close modal
            showSnackbar("Concern Posted Successfully!", "success");
        } catch (err) {
            const message =
                err.response?.data?.message || // backend error message
                err.message ||                 // axios message (e.g., "Request failed with status code 401")
                "Something went wrong";          // fallback
            showSnackbar(message, "error");
            setErrors({ submit: "Failed to submit concern. Please try again." });
        }
    };

    const handleCancel = () => {
        // ✅ Reset form on cancel
        setTitle("");
        setDescription("");
        setLocation("Hyderabad");
        setImageUrl("");
        setPreviewUrl("");
        setErrors({});
        onClose();
    };

    return (
        <AppPopUpModal
            heading="Upload Concern"
            isOpen={isOpen}
            onClose={handleCancel}
            onConfirm={handleSubmit}
            confirmText="Submit"
            cancelText="Cancel"
        >
            <div className="upload-concern-form">
                <label>
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                    />
                    {errors.title && <p className="error-text">{errors.title}</p>}
                </label>

                <label>
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className="description-textarea"
                    />
                    {errors.description && (
                        <p className="error-text">{errors.description}</p>
                    )}
                </label>

                <label>
                    Location
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        {locationOptions.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Image URL
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={handleImageChange}
                        placeholder="Paste image URL"
                    />
                    {errors.imageUrl && (
                        <p className="error-text">{errors.imageUrl}</p>
                    )}
                </label>

                {previewUrl && (
                    <div className="image-preview">
                        <img src={previewUrl} alt="Preview" />
                    </div>
                )}

                {errors.submit && (
                    <p className="error-text" style={{ marginTop: "10px" }}>
                        {errors.submit}
                    </p>
                )}
            </div>
            {appsnackbar && (
                <AppSnackbar
                    message={appsnackbar.msg}
                    type={appsnackbar.type}
                    onClose={() => setAppSnackbar(null)}
                />
            )}
        </AppPopUpModal>
    );
};

export default UploadConcernModal;
