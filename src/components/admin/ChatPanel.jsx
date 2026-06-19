"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Send, Lock, Unlock, MoreVertical, Phone, Video, Info, CheckCheck, Clock, Bot, User, AlertCircle } from "lucide-react";

export default function ChatPanel({ adminId, adminName = "Hussain Ali" }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineStatus, setOnlineStatus] = useState({});
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pollingInterval = useRef(null);
  const lastMessageCount = useRef(0);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch teachers list
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?userId=${adminId}`, {
        headers: { "x-user-role": "admin" }
      });
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
        setIsLocked(data.isLocked);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }, [adminId]);

  // Fetch chat history
  const fetchMessages = useCallback(async () => {
    if (!selectedTeacher) return;
    
    try {
      const res = await fetch(
        `/api/messages?userId=${adminId}&contactId=${selectedTeacher._id}`,
        { headers: { "x-user-role": "admin" } }
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        lastMessageCount.current = data.data.length;
        setIsLocked(data.isLocked);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [adminId, selectedTeacher]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeacher || sending) return;

    setSending(true);
    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      sender: adminId,
      receiver: selectedTeacher._id,
      text: newMessage.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      isAutoReply: false,
      isSystemMessage: false,
      isPending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify({
          sender: adminId,
          receiver: selectedTeacher._id,
          text: newMessage.trim(),
          isImportant: false
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        fetchMessages();
      } else {
        setMessages(prev => prev.map(m => 
          m._id === tempId ? { ...m, isPending: false, error: data.error } : m
        ));
      }
    } catch (error) {
      setMessages(prev => prev.map(m => 
        m._id === tempId ? { ...m, isPending: false, error: "Failed to send" } : m
      ));
    } finally {
      setSending(false);
    }
  };

  // Toggle chat lock
  const toggleLock = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify({ lockStatus: !isLocked })
      });
      const data = await res.json();
      if (data.success) {
        setIsLocked(data.isLocked);
        setShowLockDialog(false);
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
    }
  };

  // Polling for new messages
  useEffect(() => {
    if (selectedTeacher) {
      fetchMessages();
      pollingInterval.current = setInterval(fetchMessages, 3000);
      return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      };
    }
  }, [selectedTeacher, fetchMessages]);

  // Initial load
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format time
  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  // Get message icon
  const getMessageIcon = (msg) => {
    if (msg.isAutoReply) return <Bot size={14} className="text-blue-400" />;
    if (msg.isSystemMessage) return <AlertCircle size={14} className="text-yellow-400" />;
    if (msg.sender === adminId) return <User size={14} className="text-green-400" />;
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Teacher List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Teachers</h2>
            <button
              onClick={() => setShowLockDialog(true)}
              className={`p-2 rounded-lg transition-colors ${
                isLocked 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              }`}
              title={isLocked ? "Chat is locked - Click to unlock" : "Chat is open - Click to lock"}
            >
              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Teacher List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTeachers.map((teacher) => (
            <button
              key={teacher._id}
              onClick={() => setSelectedTeacher(teacher)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-700 transition-colors border-l-4 ${
                selectedTeacher?._id === teacher._id
                  ? "bg-gray-700 border-l-blue-500"
                  : "border-l-transparent"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {teacher.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white">{teacher.name}</p>
                  <span className="text-xs text-gray-400">
                    {teacher.status === "active" ? "● Active" : "○ Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{teacher.subject || "No subject"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedTeacher ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {selectedTeacher.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-white">{selectedTeacher.name}</h2>
                <p className="text-sm text-gray-400">{selectedTeacher.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Phone size={20} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Video size={20} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Info size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bot size={48} className="mb-3 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isAdmin = msg.sender === adminId;
                const isAutoReply = msg.isAutoReply;
                const isSystem = msg.isSystemMessage;
                const isPending = msg.isPending;
                
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isAdmin
                          ? isAutoReply
                            ? "bg-blue-600/30 border border-blue-500/50"
                            : "bg-blue-600"
                          : isSystem
                          ? "bg-yellow-600/20 border border-yellow-500/50"
                          : isAutoReply
                          ? "bg-purple-600/20 border border-purple-500/50"
                          : "bg-gray-700"
                      }`}
                    >
                      {/* Header with icons */}
                      <div className="flex items-center gap-1 mb-1 text-xs">
                        {getMessageIcon(msg)}
                        <span className={`${
                          isAdmin ? "text-blue-300" : isSystem ? "text-yellow-300" : "text-gray-400"
                        }`}>
                          {isAutoReply && !isAdmin ? "Auto-Reply" : 
                           isSystem ? "System" :
                           isAdmin ? "You" : selectedTeacher.name}
                        </span>
                        {isPending && <Clock size={12} className="text-yellow-400 ml-1" />}
                      </div>
                      
                      {/* Message text */}
                      <p className="text-white whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-xs text-gray-400">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isAdmin && !isPending && (
                          <CheckCheck size={14} className={msg.isRead ? "text-blue-400" : "text-gray-500"} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-gray-800 rounded-xl p-6 text-center max-w-sm mx-4">
                <Lock size={48} className="mx-auto mb-3 text-yellow-500" />
                <h3 className="text-xl font-semibold text-white mb-2">Chat is Locked</h3>
                <p className="text-gray-400 mb-4">
                  Admin has temporarily disabled chat. New messages cannot be sent.
                </p>
                <button
                  onClick={() => setShowLockDialog(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Unlock Chat
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={sendMessage} className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isLocked ? "Chat is locked..." : "Type a message..."}
                disabled={sending || isLocked}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending || isLocked}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <Bot size={64} className="mb-4 opacity-30" />
          <p className="text-lg">Select a teacher to start chatting</p>
          <p className="text-sm">Choose a teacher from the sidebar</p>
        </div>
      )}

      {/* Lock Dialog Modal */}
      {showLockDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLocked ? "Unlock Chat?" : "Lock Chat?"}
            </h3>
            <p className="text-gray-400 mb-4">
              {isLocked 
                ? "Teachers will be able to send messages again."
                : "Teachers will not be able to send any messages until you unlock it."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={toggleLock}
                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                  isLocked 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLocked ? "Yes, Unlock" : "Yes, Lock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}