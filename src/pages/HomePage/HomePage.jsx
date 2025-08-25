import React, { useState, useEffect } from "react";
import "../HomePage/HomePage.css";
import streetImage from "../../assets/login.png";
import civicBridgeRectLogo from "../../assets/CivicBridgeRectLogo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const HomePage = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    // 🔹 form data state
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
    });

    // 🔹 error messages
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // validation logic
    const validateForm = () => {
        let newErrors = {};

        if (isRegistering && !formData.name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        } else if (formData.username.length < 4) {
            newErrors.username = "Username must be at least 4 characters.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoggingIn(true);

        try {
            if (isRegistering) {
                // Registration API still direct (if you don’t have context for it yet)
                const payload = {
                    name: formData.name,
                    email: formData.username,
                    password: formData.password,
                    role: "user"
                };

                await axiosInstance.post("/users", payload);
                
            } else {
                // ✅ Use login from AuthContext
                await login(formData.username, formData.password);
                
            }

            setFormData({ name: "", username: "", password: "" });
            setErrors({});
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="login-container">
            {!isMobile && (
                <div
                    className={`login-image ${isLoggingIn ? "zoom" : ""}`}
                    style={{ backgroundImage: `url(${streetImage})` }}
                >
                    <div className="image-overlay"></div>
                </div>
            )}

            <div className="login-form-container">
                <div className="background-animation"></div>
                <div className="particles"></div>
                <div className="login-form glass-effect">
                    <h2>{isRegistering ? "✨ Join Us Today!" : "👋 Welcome Back!"}</h2>
                    <img
                        src={civicBridgeRectLogo}
                        alt="CivicBridge Logo"
                        className="login-logo"
                    />

                    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                        {isRegistering && (
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder=" "
                                />
                                <label>Name</label>
                                {errors.name && <p className="error-text">{errors.name}</p>}
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder=" "
                            />
                            <label>Username</label>
                            {errors.username && <p className="error-text">{errors.username}</p>}
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder=" "
                            />
                            <label>Password</label>
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <button type="submit" className="modern-btn">
                            {isLoggingIn
                                ? isRegistering
                                    ? "Registering..."
                                    : "Logging in..."
                                : isRegistering
                                    ? "Register"
                                    : "Login"}
                        </button>
                    </form>

                    <p className="register-text">
                        {isRegistering ? (
                            <>
                                Already have an account?{" "}
                                <b>
                                    <button
                                        type="button"
                                        className="link-button"
                                        onClick={() => setIsRegistering(false)}
                                    >
                                        Login here
                                    </button>
                                </b>
                            </>
                        ) : (
                            <>
                                Don’t have an account?{" "}
                                <b>
                                    <button
                                        type="button"
                                        className="link-button"
                                        onClick={() => setIsRegistering(true)}
                                    >
                                        Register here
                                    </button>
                                </b>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
