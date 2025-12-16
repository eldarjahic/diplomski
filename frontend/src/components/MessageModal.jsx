import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function MessageModal({
  isOpen,
  onClose,
  recipientName,
  recipientId,
  property,
  onMessageSent,
}) {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const defaultSubject = property ? `Inquiry about ${property.title}` : "";
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSubject(defaultSubject);
      setMessage("");
      setFeedback("");
      setSending(false);
    }
  }, [isOpen, defaultSubject]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setFeedback("Please log in to send a message.");
      return;
    }

    if (!recipientId) {
      setFeedback("Unable to determine the recipient for this message.");
      return;
    }

    if (!message.trim()) {
      setFeedback("Please enter a message before sending.");
      return;
    }

    setSending(true);
    setFeedback("");

    try {
      const payload = {
        recipientId,
        propertyId: property?.id ?? null,
        subject: subject.trim(),
        body: message.trim(),
      };

      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const sentMessage = data.message;
      window.dispatchEvent(new CustomEvent("message:sent", { detail: sentMessage }));

      if (onMessageSent) {
        onMessageSent(sentMessage);
      }

      setFeedback("Message sent successfully!");
      setMessage("");

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (error) {
      setFeedback(error.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
          aria-label="Close message dialog"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-1 text-2xl font-semibold text-gray-900">Send a message</h2>
        <p className="mb-4 text-sm text-gray-600">
          {recipientName ? `To: ${recipientName}` : "Compose your message"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Subject"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Write your message here..."
            />
          </div>

          {feedback && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {feedback}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l9 4 9-4-9 12-9-12z"
                />
              </svg>
              {sending ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageModal;
