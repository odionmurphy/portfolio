import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  MessageSquare,
  Users,
  BarChart3,
  Mail,
  CheckCircle,
} from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // Fetch messages
      const messagesRes = await fetch(`${apiUrl}/api/admin/messages?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setMessages(data.messages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/messages/${messageId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/messages/${selectedMessage._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reply }),
        },
      );

      if (response.ok) {
        setReply("");
        setSelectedMessage(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalMessages}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Unread</p>
                <p className="text-3xl font-bold text-white">
                  {stats.unreadMessages}
                </p>
              </div>
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Replied</p>
                <p className="text-3xl font-bold text-white">
                  {stats.repliedMessages}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Messages */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          </div>

          {messages.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No messages yet
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-6 cursor-pointer hover:bg-slate-700/50 transition ${
                    !msg.isRead ? "bg-slate-700/30" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-white">{msg.name}</p>
                        {!msg.isRead && (
                          <span className="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded">
                            Unread
                          </span>
                        )}
                        {msg.isReplied && (
                          <span className="bg-green-500 text-slate-900 text-xs px-2 py-1 rounded">
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{msg.email}</p>
                      {msg.phone && (
                        <p className="text-slate-400 text-sm">{msg.phone}</p>
                      )}
                      <p className="text-slate-300 mt-2 line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                    <p className="text-slate-500 text-sm ml-4">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedMessage.name}
                  </h3>
                  <p className="text-slate-400">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-slate-400">{selectedMessage.phone}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Message:</p>
                <p className="text-white bg-slate-700 p-4 rounded">
                  {selectedMessage.message}
                </p>
              </div>

              {!selectedMessage.isRead && (
                <button
                  onClick={() => handleMarkAsRead(selectedMessage._id)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                >
                  Mark as Read
                </button>
              )}

              <div>
                <p className="text-sm text-slate-400 mb-2">Reply:</p>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  rows={4}
                />
              </div>

              <button
                onClick={handleReply}
                disabled={!reply.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded"
              >
                Send Reply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
