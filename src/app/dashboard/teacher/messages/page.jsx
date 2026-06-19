"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Send,
  Lock,
  Unlock,
  User,
  Bot,
  CheckCheck,
  Clock,
  Loader2,
  RefreshCw,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useTeacherMessages, useSendMessage } from "@/hooks/useTeacherQueries";
import toast from "react-hot-toast";

export default function TeacherMessagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [teacherId, setTeacherId] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [limitError, setLimitError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pollingInterval = useRef(null);

  // ✅ Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    
    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }
    
    setTeacherId(userId);
  }, [router]);

  // React Query hooks
  const { 
    data: messagesData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useTeacherMessages(teacherId);
  
  const sendMessageMutation = useSendMessage();

  const messages = messagesData?.data || [];
  const isLocked = messagesData?.isLocked || false;
  const adminInfoFromAPI = messagesData?.adminInfo;
  const limits = messagesData?.limits;

  // Update adminInfo when API returns
  useEffect(() => {
    if (adminInfoFromAPI) {
      setAdminInfo(adminInfoFromAPI);
    }
  }, [adminInfoFromAPI]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message with error handling
  const sendMessage = (e) => {
    e.preventDefault();
    
    // Check if chat is locked
    if (isLocked) {
      setLimitError({
        type: "lock",
        title: "Chat is Locked",
        message: "Admin has temporarily disabled chat. You cannot send new messages right now."
      });
      setShowLimitDialog(true);
      return;
    }
    
    if (!newMessage.trim() || !teacherId || !adminInfo?._id) return;

    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      sender: teacherId,
      receiver: adminInfo._id,
      text: newMessage.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      isPending: true
    };

    // Optimistic update
    queryClient.setQueryData(["teacher", "messages", teacherId], (old) => ({
      ...old,
      data: [...(old?.data || []), tempMessage]
    }));

    sendMessageMutation.mutate({
      sender: teacherId,
      receiver: adminInfo._id,
      text: newMessage.trim()
    }, {
      onSuccess: () => {
        setNewMessage("");
        refetch();
        setLimitError(null);
        setShowLimitDialog(false);
      },
      onError: (err) => {
        const errorData = err.response?.data;
        const status = err.response?.status;
        
        // Handle different error types
        if (status === 429) {
          if (errorData?.limitType === "daily") {
            setLimitError({
              type: "daily",
              title: "Daily Message Limit Reached",
              message: errorData.error || `You have reached your daily limit of 30 messages. Please try again tomorrow.`,
              remaining: errorData?.remaining,
              used: errorData?.used
            });
          } else if (errorData?.limitType === "rate") {
            setLimitError({
              type: "rate",
              title: "Too Many Messages",
              message: errorData.error || `Please wait ${errorData?.waitTime || 60} seconds before sending another message.`,
              waitTime: errorData?.waitTime
            });
          } else {
            setLimitError({
              type: "limit",
              title: "Message Limit Reached",
              message: errorData?.error || "You have reached the message limit. Please try again later."
            });
          }
          setShowLimitDialog(true);
        } else if (status === 403) {
          setLimitError({
            type: "lock",
            title: "Chat is Locked",
            message: errorData?.error || "Chat is currently locked by admin."
          });
          setShowLimitDialog(true);
        } else {
          toast.error(errorData?.error || "Failed to send message");
        }
        
        // Remove optimistic message
        refetch();
      }
    });
  };

  // Polling for new messages
  useEffect(() => {
    if (teacherId) {
      refetch();
      pollingInterval.current = setInterval(refetch, 5000);
    }
    
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [teacherId, refetch]);

  // Format time
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  // Check if message is from teacher
  const isTeacherMessage = (msg) => {
    return msg.sender === teacherId;
  };

  // Check if message is AI auto-reply
  const isAutoReply = (text) => {
    return text?.startsWith("[Away]") || text?.startsWith("[Auto-Reply]");
  };

  // Clean message text
  const cleanMessageText = (text) => {
    if (text?.startsWith("[Away]")) {
      return text.replace("[Away]", "").trim();
    }
    if (text?.startsWith("[Auto-Reply]")) {
      return text.replace("[Auto-Reply]", "").trim();
    }
    return text;
  };

  // Get message style
  const getMessageStyle = (msg) => {
    const isTeacher = isTeacherMessage(msg);
    const isAuto = isAutoReply(msg.text);
    
    if (isTeacher) {
      return "bg-blue-600 text-white";
    }
    if (isAuto) {
      return "bg-purple-600/30 border border-purple-500/50 text-white";
    }
    return "bg-gray-700 text-white";
  };

  // Get limits info
  const remainingMessages = limits?.daily?.remaining;
  const isLowOnMessages = remainingMessages !== undefined && remainingMessages < 10 && remainingMessages > 0;
  const isLimitReached = remainingMessages === 0;

  // Loading state
  if (isLoading && !teacherId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {adminInfo?.name?.charAt(0) || "A"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{adminInfo?.name || "Admin"}</h2>
              <p className="text-xs text-gray-400">Online • Usually replies within minutes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={18} className={`text-gray-400 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Phone size={18} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Video size={18} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Info size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Lock Warning Banner */}
        {isLocked && (
          <div className="bg-red-500/10 border-b border-red-500/30 p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Lock size={16} className="text-red-400" />
              <p className="text-red-400 text-sm">
                🔒 Chat is currently locked by admin. You cannot send new messages.
              </p>
            </div>
          </div>
        )}

        {/* Daily Limit Reached Banner */}
        {isLimitReached && !isLocked && (
          <div className="bg-orange-500/10 border-b border-orange-500/30 p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle size={16} className="text-orange-400" />
              <p className="text-orange-400 text-sm">
                ⚠️ Daily message limit reached (30/30). You can send more messages tomorrow.
              </p>
            </div>
          </div>
        )}

        {/* Low Message Warning */}
        {isLowOnMessages && !isLocked && !isLimitReached && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-2 text-center">
            <p className="text-yellow-400 text-xs flex items-center justify-center gap-2">
              <AlertCircle size={12} />
              ⚠️ Only {remainingMessages} messages left today.
            </p>
          </div>
        )}

        {/* Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare size={48} className="mb-3 opacity-30" />
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isTeacher = isTeacherMessage(msg);
              const isAuto = isAutoReply(msg.text);
              const displayText = cleanMessageText(msg.text);
              
              return (
                <div
                  key={msg._id || idx}
                  className={`flex ${isTeacher ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${getMessageStyle(msg)}`}
                  >
                    <div className="flex items-center gap-1 mb-1 text-xs">
                      {!isTeacher && !isAuto && <User size={12} className="text-gray-400" />}
                      {!isTeacher && isAuto && <Bot size={12} className="text-purple-400" />}
                      <span className={isTeacher ? "text-blue-300" : "text-gray-400"}>
                        {isTeacher ? "You" : isAuto ? "Admin (Auto)" : adminInfo?.name || "Admin"}
                      </span>
                      {msg.isPending && <Clock size={12} className="text-yellow-400 ml-1" />}
                    </div>
                    
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {displayText}
                    </p>
                    
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isTeacher && !msg.isPending && (
                        <CheckCheck size={12} className={msg.isRead ? "text-blue-400" : "text-gray-500"} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {sendMessageMutation.isPending && (
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

        {/* Input Area - Disabled when locked or limit reached */}
        <form onSubmit={sendMessage} className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLocked || isLimitReached}
            >
              <Paperclip size={18} className="text-gray-400" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLocked || isLimitReached}
            >
              <Smile size={18} className="text-gray-400" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isLocked ? "🔒 Chat is locked..." :
                isLimitReached ? "⚠️ Daily limit reached. Try again tomorrow..." :
                "Type a message..."
              }
              disabled={sendMessageMutation.isPending || isLocked || isLimitReached}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sendMessageMutation.isPending || isLocked || isLimitReached}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendMessageMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>

      {/* Limit/Dialog Modal */}
      {showLimitDialog && limitError && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className={`p-5 ${
              limitError.type === "lock" ? "bg-red-500/20 border-b border-red-500/30" :
              limitError.type === "daily" ? "bg-orange-500/20 border-b border-orange-500/30" :
              "bg-yellow-500/20 border-b border-yellow-500/30"
            }`}>
              <div className="flex items-center gap-3">
                {limitError.type === "lock" ? (
                  <Lock size={28} className="text-red-400" />
                ) : limitError.type === "daily" ? (
                  <AlertCircle size={28} className="text-orange-400" />
                ) : (
                  <Clock size={28} className="text-yellow-400" />
                )}
                <h2 className="text-xl font-bold text-white">{limitError.title}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-300 text-center">{limitError.message}</p>
              
              {limitError.type === "daily" && limitError.used !== undefined && (
                <div className="mt-4 bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-400">
                    Messages today: <span className="text-orange-400 font-semibold">{limitError.used}/30</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Limit resets at midnight (12:00 AM)
                  </p>
                </div>
              )}

              {limitError.type === "rate" && limitError.waitTime && (
                <div className="mt-4 bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-400">
                    Please wait <span className="text-yellow-400 font-semibold">{limitError.waitTime} seconds</span> before trying again.
                  </p>
                </div>
              )}

              {limitError.type === "lock" && (
                <div className="mt-4 bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-400">
                    Contact admin to unlock the chat.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => setShowLimitDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Close
              </button>
              {limitError.type !== "lock" && (
                <button
                  onClick={() => {
                    setShowLimitDialog(false);
                    refetch();
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Check Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}