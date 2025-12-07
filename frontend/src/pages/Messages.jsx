import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

const buildChatKey = (otherUserId, propertyId) =>
  `${otherUserId}:${propertyId ?? "none"}`;

const getDisplayName = (user) => {
  if (!user) return "Conversation";
  if (user.username) return user.username;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (fullName) return fullName;
  return user.email || "Conversation";
};

const normalizeProperty = (property) => {
  if (!property) return null;
  return {
    id: property.id,
    title: property.title,
    imageUrl: property.imageUrl || null,
  };
};

const normalizeMessage = (message) => ({
  id: message.id,
  fromUserId: message.sender?.id,
  text: message.body,
  subject: message.subject,
  time: message.createdAt,
  isRead: Boolean(message.isRead),
});

function Messages() {
  const { isAuthenticated, loading, user, getAuthHeaders } = useAuth();
  const currentUserId = user?.id ?? null;

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const convertMessagesToChats = useCallback(
    (messagesList) => {
      if (!currentUserId) return [];
      const map = new Map();

      messagesList.forEach((message) => {
        const otherUser =
          message.sender?.id === currentUserId
            ? message.recipient
            : message.sender;

        if (!otherUser) {
          return;
        }

        const property = normalizeProperty(message.property);
        const key = buildChatKey(otherUser.id, property?.id ?? null);
        if (!map.has(key)) {
          map.set(key, {
            id: key,
            contactId: otherUser.id,
            contactName: getDisplayName(otherUser),
            property,
            messages: [],
            preview: "",
            lastMessageAt: "",
          });
        }

        const normalizedMsg = normalizeMessage(message);
        const chat = map.get(key);
        chat.messages.push(normalizedMsg);
      });

      const chatsArray = Array.from(map.values()).map((chat) => {
        const sortedMessages = chat.messages.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        const latest = sortedMessages[sortedMessages.length - 1];
        return {
          ...chat,
          messages: sortedMessages,
          preview: latest?.text || "",
          lastMessageAt: latest?.time || "",
        };
      });

      chatsArray.sort((a, b) => {
        return (
          new Date(b.lastMessageAt || 0).getTime() -
          new Date(a.lastMessageAt || 0).getTime()
        );
      });

      return chatsArray;
    },
    [currentUserId]
  );

  const appendMessageToChats = useCallback(
    (prevChats, message) => {
      if (!currentUserId) return prevChats;

      const otherUser =
        message.sender?.id === currentUserId
          ? message.recipient
          : message.sender;
      if (!otherUser) return prevChats;

      const property = normalizeProperty(message.property);
      const key = buildChatKey(otherUser.id, property?.id ?? null);
      const normalizedMsg = normalizeMessage(message);

      const updatedChats = [...prevChats];
      const existingIndex = updatedChats.findIndex((chat) => chat.id === key);

      if (existingIndex >= 0) {
        const updatedChat = { ...updatedChats[existingIndex] };
        updatedChat.messages = [...updatedChat.messages, normalizedMsg].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        updatedChat.preview = normalizedMsg.text;
        updatedChat.lastMessageAt = normalizedMsg.time;
        updatedChat.contactName =
          updatedChat.contactName || getDisplayName(otherUser);
        updatedChat.property = updatedChat.property || property;
        updatedChats[existingIndex] = updatedChat;
      } else {
        updatedChats.push({
          id: key,
          contactId: otherUser.id,
          contactName: getDisplayName(otherUser),
          property,
          messages: [normalizedMsg],
          preview: normalizedMsg.text,
          lastMessageAt: normalizedMsg.time,
        });
      }

      updatedChats.sort((a, b) => {
        return (
          new Date(b.lastMessageAt || 0).getTime() -
          new Date(a.lastMessageAt || 0).getTime()
        );
      });

      if (message.recipient?.id === currentUserId && message.isRead === false) {
        window.dispatchEvent(new CustomEvent("messages:refresh"));
      }

      return updatedChats;
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      setChats([]);
      setSelectedChatId(null);
      return;
    }

    let isCancelled = false;

    const loadMessages = async () => {
      setLoadingMessages(true);
      setFetchError("");

      try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages`, { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load messages");
        }

        if (isCancelled) {
          return;
        }

        const messagesList = Array.isArray(data.messages) ? data.messages : [];
        const normalizedChats = convertMessagesToChats(messagesList);
        setChats(normalizedChats);
        setSelectedChatId((prev) => {
          if (normalizedChats.length === 0) {
            return null;
          }

          const stillExists = normalizedChats.some((chat) => chat.id === prev);
          return stillExists ? prev : normalizedChats[0].id;
        });

        const unreadForUser = messagesList.filter(
          (message) =>
            message.recipient?.id === currentUserId && message.isRead === false
        ).length;

        window.dispatchEvent(
          new CustomEvent("messages:refresh", { detail: unreadForUser })
        );
      } catch (error) {
        if (!isCancelled) {
          setFetchError(error.message || "Failed to load messages");
          setChats([]);
          setSelectedChatId(null);
        }
      } finally {
        if (!isCancelled) {
          setLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      isCancelled = true;
    };
  }, [convertMessagesToChats, currentUserId, getAuthHeaders, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      return;
    }

    const handler = (event) => {
      const message = event.detail;
      if (!message) return;

      const propertyId = message.property?.id ?? null;
      const otherUser =
        message.sender?.id === currentUserId
          ? message.recipient
          : message.sender;

      if (!otherUser) return;

      const chatKey = buildChatKey(otherUser.id, propertyId);

      setChats((prev) => appendMessageToChats(prev, message));
      setSelectedChatId((prev) => prev ?? chatKey);
    };

    window.addEventListener("message:sent", handler);

    return () => {
      window.removeEventListener("message:sent", handler);
    };
  }, [appendMessageToChats, currentUserId, isAuthenticated]);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) || null,
    [chats, selectedChatId]
  );

  useEffect(() => {
    if (!selectedChat || !currentUserId || !isAuthenticated) {
      return;
    }

    const unreadMessages = selectedChat.messages.filter(
      (message) => message.fromUserId !== currentUserId && !message.isRead
    );

    if (unreadMessages.length === 0) {
      return;
    }

    const messageIds = [
      ...new Set(unreadMessages.map((message) => message.id)),
    ];
    const chatId = selectedChat.id;

    const markAsRead = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages/mark-read`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ messageIds }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to mark messages as read");
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((message) =>
                    messageIds.includes(message.id)
                      ? { ...message, isRead: true }
                      : message
                  ),
                }
              : chat
          )
        );

        // Update header badge via returned count (if available)
        window.dispatchEvent(
          new CustomEvent("messages:refresh", {
            detail: typeof data.count === "number" ? data.count : undefined,
          })
        );
        // Fallback: force refetch to avoid any drift
        if (typeof data.count !== "number") {
          window.dispatchEvent(new CustomEvent("messages:refresh"));
        }
      } catch (error) {
        console.error("Failed to mark messages as read", error);
      }
    };

    markAsRead();
  }, [getAuthHeaders, isAuthenticated, currentUserId, selectedChat]);

  if (!loading && !isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center px-4 py-12 text-center">
        <div className="rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-2-2H8a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-3l-2 2z"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please log in to view your conversations.
          </p>
          <a
            href="/login"
            className="mt-4 inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Go to login
          </a>
        </div>
      </main>
    );
  }

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setDraftMessage("");
    setSendError("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedChat || !draftMessage.trim() || !currentUserId) return;

    setSendError("");
    setSending(true);

    try {
      const headers = getAuthHeaders();
      const payload = {
        recipientId: selectedChat.contactId,
        propertyId: selectedChat.property?.id ?? null,
        subject: selectedChat.property
          ? `Inquiry about ${selectedChat.property.title}`
          : null,
        body: draftMessage.trim(),
      };

      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const message = data.message;
      const propertyId = message.property?.id ?? null;
      const otherUser =
        message.sender?.id === currentUserId
          ? message.recipient
          : message.sender;
      const chatKey = otherUser
        ? buildChatKey(otherUser.id, propertyId)
        : selectedChat.id;

      setChats((prev) => appendMessageToChats(prev, message));
      setSelectedChatId(chatKey);
      setDraftMessage("");
    } catch (error) {
      setSendError(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="w-full rounded-3xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur md:w-80">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white">
            {chats.length}
          </span>
        </div>

        {fetchError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
            {fetchError}
          </div>
        )}

        {loadingMessages ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
            Loading conversations...
          </div>
        ) : chats.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
            You haven’t started any conversations yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full rounded-2xl border border-gray-200 px-4 py-3 text-left transition hover:border-gray-300 hover:bg-white ${
                    chat.id === selectedChatId
                      ? "border-gray-900 bg-white shadow"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        {chat.contactName}
                      </h2>
                      {chat.property && (
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                          {chat.property.title}
                        </p>
                      )}
                    </div>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                    {chat.preview}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="flex w-full flex-1 flex-col rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        {selectedChat ? (
          <>
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedChat.contactName}
                </h2>
                {selectedChat.property ? (
                  <p className="text-sm text-gray-500">
                    Regarding {selectedChat.property.title}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Active conversation</p>
                )}
              </div>
            </header>

            <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white/60 p-4 shadow-inner">
              {selectedChat.messages.map((message) => {
                const isMine = message.fromUserId === currentUserId;
                const timeFormatted = new Date(message.time).toLocaleTimeString(
                  "bs-BA",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <div
                    key={message.id}
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow ${
                      isMine
                        ? "ml-auto bg-gray-900 text-white"
                        : "mr-auto border border-gray-200 bg-white text-gray-900"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="mt-1 block text-right text-[10px] text-gray-400">
                      {timeFormatted}
                    </span>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="mt-auto flex flex-col gap-2 md:flex-row md:items-center"
            >
              <textarea
                rows={2}
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage(event);
                  }
                }}
                placeholder="Write a message..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                disabled={sending || !draftMessage.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
                    d="M3 10h2l1 2 5-5 5 9 3-4 2 3"
                  />
                </svg>
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
            {sendError && (
              <p className="mt-2 text-xs text-red-600">{sendError}</p>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-gray-600">
            <svg
              className="mb-3 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-2-2H8a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-3l-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">No conversation selected</p>
            <p className="text-xs text-gray-500">
              Choose a chat from the list or start a new conversation from a
              property listing.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Messages;
