import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import "./ChatLayout.css";

export default function ChatLayout() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // ✅ get userId from localStorage
    const parsedData = localStorage.getItem("UserData");
    const userId = parsedData ? JSON.parse(parsedData).id : null;

    // ✅ Fetch chat history
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axiosInstance.get(`/chats/${userId}`);
                if (res.data.success) {
                    const formatted = res.data.data.map((chat) => [
                        { sender: "user", text: chat.question },
                        { sender: "ai", text: chat.answer },
                    ]);
                    const flattened = formatted.flat();

                    // ✅ If no history, add default AI greeting
                    if (flattened.length === 0) {
                        setMessages([{ sender: "ai", text: "Hello! How may I help you today?" }]);
                    } else {
                        setMessages(flattened);
                    }
                }
            } catch (err) {
                console.error("Error fetching chats:", err);
                // fallback default AI greeting if fetch fails
                setMessages([{ sender: "ai", text: "Hello! How may I help you today?" }]);
            }
        };
        if (userId) fetchChats();
    }, [userId]);


    // ✅ Handle send
    const handleSend = async () => {
        if (!input.trim()) return;

        const question = input.trim();
        setInput("");

        // Temporary "thinking" bubble
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: question },
            { sender: "ai", text: "..." },
        ]);

        try {
            await axiosInstance.post("/chats", {
                userId,
                question,
            });

            // ✅ Re-fetch chats from backend after saving
            const res = await axiosInstance.get(`/chats/${userId}`);
            if (res.data.success) {
                const formatted = res.data.data.map((chat) => [
                    { sender: "user", text: chat.question },
                    { sender: "ai", text: chat.answer },
                ]);
                setMessages(formatted.flat());
            }
        } catch (err) {
            console.error("Error sending chat:", err);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { sender: "ai", text: "⚠️ Something went wrong, please try again." },
            ]);
        }
    };


    return (
        <div className="chat-container">
            <div className="chat-header">CivicSense Assistant</div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${msg.sender === "ai" ? "ai-bubble" : "user-bubble"}`}
                    >
                        <div className="chat-icon">
                            {msg.sender === "ai" ? <FaRobot /> : <FaUser />}
                        </div>
                        <div className="chat-content">
                            <div className="chat-text">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {/* 👇 keeps scroll pinned to bottom */}
                <div ref={messagesEndRef} />
            </div>



            <div className="chat-input-bar">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}
