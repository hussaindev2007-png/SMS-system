"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, CheckCheck, Clock, Bot, User, AlertCircle, ArrowLeft, Lock, Phone, Video, Info, Paperclip, Smile } from "lucide-react";

export default function ChatWindow({ 
  adminId, 
  adminName, 
  teacher, 
  isLocked, 
  onBack,
  onMessageSent 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pollingInterval = useRef(null);
  const typingTimeout = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!teacher) return;
    
    try {
      const res = await fetch(
        `/api/messages?userId=${adminId}&contactId=${teacher._id}`,
        { headers: { "x-user-role": "admin" } }
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [adminId, teacher]);

  // Polling for new messages
  useEffect(() => {
    if (teacher) {
      fetchMessages();
      pollingInterval.current = setInterval(fetchMessages, 3000);
      return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      };
    }
  }, [teacher, fetchMessages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || isLocked) return;

    setSending(true);
    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      sender: adminId,
      receiver: teacher._id,
      text: newMessage.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      isAutoReply: false,
      isSystemMessage: false,
      isPending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    scrollToBottom();

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify({
          sender: adminId,
          receiver: teacher._id,
          text: tempMessage.text,
          isImportant: false
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        fetchMessages();
        onMessageSent?.();
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

  // Simulate typing indicator (optional)
  const handleTyping = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setIsTyping(true);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1000);
  };

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

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  // Get message icon
  const getMessageIcon = (msg) => {
    if (msg.isAutoReply && !msg.isSystemMessage) return <Bot size={14} className="text-purple-400" />;
    if (msg.isSystemMessage) return <AlertCircle size={14} className="text-yellow-400" />;
    if (msg.sender === adminId) return <User size={14} className="text-blue-400" />;
    return null;
  };

  // Get message style
  const getMessageStyle = (msg) => {
    if (msg.sender === adminId) {
      if (msg.isAutoReply) return "bg-blue-600/30 border border-blue-500/50";
      return "bg-blue-600";
    } else {
      if (msg.isSystemMessage) return "bg-yellow-600/20 border border-yellow-500/50";
      if (msg.isAutoReply) return "bg-purple-600/20 border border-purple-500/50";
      return "bg-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {teacher.name.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${teacher.status === "active" ? "bg-green-500" : "bg-gray-500"} border-2 border-gray-800`} />
          </div>
          <div>
            <h2 className="font-semibold text-white">{teacher.name}</h2>
            <p className="text-xs text-gray-400">{teacher.subject || "Teacher"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Voice call">
            <Phone size={18} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Video call">
            <Video size={18} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Info">
            <Info size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare size={48} className="mb-3 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Send a message to start the conversation</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </span>
              </div>
              
              {/* Messages */}
              {dateMessages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.sender === adminId ? "justify-end" : "justify-start"} mb-3`}
                >
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${getMessageStyle(msg)}`}>
                    {/* Header with icons */}
                    <div className="flex items-center gap-1 mb-1 text-xs">
                      {getMessageIcon(msg)}
                      <span className={msg.sender === adminId ? "text-blue-300" : "text-gray-400"}>
                        {msg.isAutoReply && msg.sender !== adminId ? "Auto-Reply" : 
                         msg.isSystemMessage ? "System" :
                         msg.sender === adminId ? "You" : teacher.name}
                      </span>
                      {msg.isPending && <Clock size={12} className="text-yellow-400 ml-1" />}
                    </div>
                    
                    {/* Message text */}
                    <p className="text-white whitespace-pre-wrap break-words text-sm">
                      {msg.text}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </span>
                      {msg.sender === adminId && !msg.isPending && (
                        <CheckCheck size={14} className={msg.isRead ? "text-blue-400" : "text-gray-500"} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-gray-800 rounded-xl p-6 text-center max-w-sm mx-4">
            <Lock size={48} className="mx-auto mb-3 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white mb-2">Chat is Locked</h3>
            <p className="text-sm text-gray-400 mb-4">
              Admin has temporarily disabled chat. You cannot send messages right now.
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={sendMessage} className="bg-gray-800/50 border-t border-gray-700 p-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLocked}
          >
            <Paperclip size={18} className="text-gray-400" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLocked}
          >
            <Smile size={18} className="text-gray-400" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder={isLocked ? "Chat is locked..." : "Type a message..."}
            disabled={sending || isLocked}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || isLocked}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}