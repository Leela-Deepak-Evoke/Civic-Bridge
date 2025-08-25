// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ initialize from localStorage directly
    const stored = localStorage.getItem("UserData");
    return stored ? JSON.parse(stored) : null;
  });
  

  // ✅ Login
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/users/login", { email, password });
      localStorage.setItem("UserData", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      const token = user?.idToken;
      if (token) {
        await axiosInstance.post("/users/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      localStorage.removeItem("UserData");
      sessionStorage.clear();
      setUser(null);
    } catch (err) {
      console.error("❌ Logout failed:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
