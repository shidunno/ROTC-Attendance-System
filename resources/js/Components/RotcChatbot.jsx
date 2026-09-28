import React, { useEffect, useState } from "react";

export default function RotcChatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content:
                "Hello! I'm the ROTC Assistant. How can I help you?",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const openChatbot = () => {
            setOpen(true);
        };

        window.addEventListener(
            "open-rotc-chatbot",
            openChatbot
        );

        return () => {
            window.removeEventListener(
                "open-rotc-chatbot",
                openChatbot
            );
        };
    }, []);

    const sendMessage = async (event) => {
        event?.preventDefault();

        const text = message.trim();

        if (!text || loading) {
            return;
        }

        setError("");

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: text,
        };

        setMessages((current) => [
            ...current,
            userMessage,
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/rotc-chatbot/message",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document
                                .querySelector(
                                    'meta[name="csrf-token"]'
                                )
                                ?.getAttribute("content") || "",
                    },
                    body: JSON.stringify({
                        message: text,
                    }),
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to send your message right now."
                );
            }

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        data.message ||
                        "I don't have enough information to answer that accurately.",
                },
            ]);
        } catch (err) {
            setError(
                err.message ||
                    "I'm currently unable to respond. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage(event);
        }
    };

    return (
        <>
            {/* CHATBOT FLOATING OVERLAY */}
            {open && (
                <div
                    className="rotc-chatbot-panel"
                    role="dialog"
                    aria-modal="false"
                    aria-label="ROTC Assistant"
                >
                    {/* HEADER */}
                    <div className="rotc-chatbot-header">
                        <div className="rotc-chatbot-header-content">
                            <div className="rotc-chatbot-title">
                                ROTC Assistant
                            </div>

                            <div className="rotc-chatbot-status">
                                Support Assistant
                            </div>
                        </div>

                        <button
                            type="button"
                            className="rotc-chatbot-close"
                            onClick={() =>
                                setOpen(false)
                            }
                            aria-label="Close ROTC Assistant"
                        >
                            ×
                        </button>
                    </div>

                    {/* CHAT MESSAGES */}
                    <div
                        className="rotc-chatbot-messages"
                        aria-live="polite"
                    >
                        {messages.map((item) => (
                            <div
                                key={item.id}
                                className={`rotc-chatbot-message ${
                                    item.role === "user"
                                        ? "rotc-chatbot-message-user"
                                        : "rotc-chatbot-message-assistant"
                                }`}
                            >
                                {item.content}
                            </div>
                        ))}

                        {loading && (
                            <div className="rotc-chatbot-message rotc-chatbot-message-assistant">
                                Thinking...
                            </div>
                        )}

                        {error && (
                            <div className="rotc-chatbot-error">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* MESSAGE INPUT */}
                    <form
                        className="rotc-chatbot-input-area"
                        onSubmit={sendMessage}
                    >
                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            maxLength={2000}
                            rows={1}
                            disabled={loading}
                            aria-label="Chat message"
                        />

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !message.trim()
                            }
                            aria-label="Send message"
                        >
                            <span aria-hidden="true">
                                ➤
                            </span>
                        </button>
                    </form>
                </div>
            )}

            {/* FLOATING CHAT BUTTON */}
            <button
                type="button"
                className="rotc-chatbot-button"
                onClick={() =>
                    setOpen((current) => !current)
                }
                aria-label={
                    open
                        ? "Close ROTC Assistant"
                        : "Open ROTC Assistant"
                }
                aria-expanded={open}
            >
                <span aria-hidden="true">
                    💬
                </span>
            </button>
        </>
    );
}