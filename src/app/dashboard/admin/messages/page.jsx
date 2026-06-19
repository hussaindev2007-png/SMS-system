// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   MessageSquare, 
//   Send, 
//   Lock, 
//   Unlock,
//   User, 
//   CheckCheck, 
//   Clock, 
//   Loader2,
//   RefreshCw,
//   Users,
//   ArrowLeft,
//   Bot,
//   AlertCircle,
//   Shield,
//   Eye,
//   EyeOff
// } from "lucide-react";

// export default function AdminMessagesPage() {
//   const router = useRouter();
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [teachers, setTeachers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isLocked, setIsLocked] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [mobileView, setMobileView] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [adminId, setAdminId] = useState(null);
//   const [error, setError] = useState("");
//   const [showLockDialog, setShowLockDialog] = useState(false);
//   const [teacherLimits, setTeacherLimits] = useState({});
  
//   const messagesEndRef = useRef(null);
//   const pollingInterval = useRef(null);

//   // ✅ Get admin info from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     const userId = localStorage.getItem("userId");
    
//     console.log("Auth Check:", { token: !!token, userRole, userId });
    
//     if (!token || userRole !== "admin") {
//       router.push("/login");
//       return;
//     }
    
//     setAdminId(userId);
//   }, [router]);

//   // Check screen size for mobile view
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const isMobile = window.innerWidth < 768;
//       setMobileView(isMobile);
//       if (isMobile && selectedTeacher) {
//         setShowSidebar(false);
//       } else {
//         setShowSidebar(true);
//       }
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, [selectedTeacher]);

//   // Auto-scroll to bottom
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // ✅ Toggle Chat Lock
//   const toggleLock = async () => {
//     try {
//       const res = await fetch("/api/admin/messages", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           "x-user-role": "admin"
//         },
//         body: JSON.stringify({ lockStatus: !isLocked })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setIsLocked(data.isLocked);
//         setShowLockDialog(false);
//         // Show success message
//         alert(data.isLocked ? "🔒 Chat has been locked" : "🔓 Chat has been unlocked");
//       }
//     } catch (error) {
//       console.error("Error toggling lock:", error);
//       setError("Failed to toggle chat lock");
//     }
//   };

//   // ✅ Fetch teachers list
//   const fetchTeachers = async () => {
//     try {
//       const userId = adminId || localStorage.getItem("userId");
//       console.log("Fetching teachers for admin:", userId);
      
//       const res = await fetch(`/api/admin/messages?userId=${userId}`, {
//         headers: { "x-user-role": "admin" }
//       });
      
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }
      
//       const data = await res.json();
//       console.log("Teachers API response:", data);
      
//       if (data.success) {
//         setTeachers(data.teachers || []);
//         setIsLocked(data.isLocked || false);
//       } else {
//         setError(data.error || "Failed to load teachers");
//       }
//     } catch (error) {
//       console.error("Error fetching teachers:", error);
//       setError("Network error. Please refresh.");
//     }
//   };

//   // ✅ Fetch chat history with selected teacher
//   const fetchMessages = async () => {
//     if (!selectedTeacher || !adminId) return;
    
//     try {
//       const res = await fetch(`/api/admin/messages?userId=${adminId}&contactId=${selectedTeacher._id}`, {
//         headers: { "x-user-role": "admin" }
//       });
      
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }
      
//       const data = await res.json();
      
//       if (data.success) {
//         setMessages(data.data || []);
//         setIsLocked(data.isLocked || false);
        
//         // Store teacher limits if available
//         if (data.limits) {
//           setTeacherLimits(prev => ({
//             ...prev,
//             [selectedTeacher._id]: data.limits
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   // ✅ Send message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || sending || isLocked || !selectedTeacher) return;

//     setSending(true);
    
//     const tempId = Date.now();
//     const tempMessage = {
//       _id: tempId,
//       sender: adminId,
//       receiver: selectedTeacher._id,
//       text: newMessage.trim(),
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       isPending: true
//     };

//     setMessages(prev => [...prev, tempMessage]);
//     setNewMessage("");
//     scrollToBottom();

//     try {
//       const res = await fetch("/api/admin/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-user-role": "admin"
//         },
//         body: JSON.stringify({
//           sender: adminId,
//           receiver: selectedTeacher._id,
//           text: tempMessage.text
//         })
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         setMessages(prev => prev.filter(m => m._id !== tempId));
//         fetchMessages();
//       } else {
//         setMessages(prev => prev.map(m => 
//           m._id === tempId ? { ...m, isPending: false, error: data.error } : m
//         ));
//         setError(data.error || "Failed to send message");
//       }
//     } catch (error) {
//       setMessages(prev => prev.map(m => 
//         m._id === tempId ? { ...m, isPending: false, error: "Failed to send" } : m
//       ));
//       setError("Network error. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   // ✅ Polling for new messages
//   useEffect(() => {
//     if (selectedTeacher && adminId) {
//       fetchMessages();
//       pollingInterval.current = setInterval(fetchMessages, 5000);
//       return () => {
//         if (pollingInterval.current) clearInterval(pollingInterval.current);
//       };
//     }
//   }, [selectedTeacher, adminId]);

//   // Load teachers when adminId is available
//   useEffect(() => {
//     if (adminId) {
//       fetchTeachers();
//       setLoading(false);
//     }
//   }, [adminId]);

//   // Format time
//   const formatTime = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const now = new Date();
//     const diff = now - d;
    
//     if (diff < 60000) return "Just now";
//     if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
//     if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     return d.toLocaleDateString();
//   };

//   // Check if message is from admin
//   const isAdminMessage = (msg) => {
//     return msg.sender === adminId;
//   };

//   // Get message style
//   const getMessageStyle = (msg) => {
//     const isAdmin = isAdminMessage(msg);
//     const isAuto = msg.isAutoReply;
    
//     if (isAdmin) {
//       return "bg-blue-600 text-white";
//     }
//     if (isAuto) {
//       return "bg-purple-600/30 border border-purple-500/50 text-white";
//     }
//     return "bg-gray-700 text-white";
//   };

//   // Get message icon
//   const getMessageIcon = (msg) => {
//     const isAdmin = isAdminMessage(msg);
//     const isAuto = msg.isAutoReply;
//     const isSystem = msg.isSystemMessage;
    
//     if (isAuto && !isAdmin) return <Bot size={12} className="text-purple-400 mr-1" />;
//     if (isSystem) return <AlertCircle size={12} className="text-yellow-400 mr-1" />;
//     if (isAdmin) return <User size={12} className="text-blue-300 mr-1" />;
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-400">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <div className="flex flex-col h-screen">
//         {/* Header */}
//         <div className="bg-gray-800 border-b border-gray-700 p-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <MessageSquare className="text-blue-500" size={24} />
//               <div>
//                 <h1 className="text-lg font-bold text-white">Messages</h1>
//                 <p className="text-xs text-gray-400">
//                   {isLocked ? "🔒 Chat is locked" : "💬 Chat with teachers"}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               {/* Lock/Unlock Button */}
//               <button
//                 onClick={() => setShowLockDialog(true)}
//                 className={`p-2 rounded-lg transition-colors ${
//                   isLocked 
//                     ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
//                     : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
//                 }`}
//                 title={isLocked ? "Chat is locked - Click to unlock" : "Chat is open - Click to lock"}
//               >
//                 {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
//               </button>
              
//               {mobileView && selectedTeacher && (
//                 <button
//                   onClick={() => {
//                     setShowSidebar(true);
//                     setSelectedTeacher(null);
//                   }}
//                   className="px-3 py-1.5 bg-gray-700 rounded-lg text-white text-sm flex items-center gap-1"
//                 >
//                   <ArrowLeft size={14} /> Back
//                 </button>
//               )}
              
//               {!mobileView && (
//                 <button
//                   onClick={fetchTeachers}
//                   className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//                   title="Refresh"
//                 >
//                   <RefreshCw size={18} className="text-gray-400" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-500/10 border-b border-red-500/30 p-2 text-center">
//             <p className="text-red-400 text-xs flex items-center justify-center gap-1">
//               <AlertCircle size={12} />
//               {error}
//             </p>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Sidebar - Teachers List */}
//           {(showSidebar || !mobileView) && (
//             <div className={`${mobileView ? 'w-full' : 'w-72'} border-r border-gray-700 flex flex-col`}>
//               <div className="p-3 border-b border-gray-700">
//                 <h3 className="text-white font-medium flex items-center gap-2">
//                   <Users size={16} />
//                   Teachers
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-1">{teachers.length} teachers total</p>
//               </div>
//               <div className="flex-1 overflow-y-auto">
//                 {teachers.length === 0 ? (
//                   <div className="p-4 text-center text-gray-500">
//                     <Users size={32} className="mx-auto mb-2 opacity-30" />
//                     <p className="text-sm">No teachers found</p>
//                     <p className="text-xs mt-1">Add teachers first</p>
//                   </div>
//                 ) : (
//                   teachers.map((teacher) => {
//                     const limits = teacherLimits[teacher._id];
//                     const isLowOnMessages = limits?.daily?.remaining < 10;
                    
//                     return (
//                       <button
//                         key={teacher._id}
//                         onClick={() => {
//                           setSelectedTeacher(teacher);
//                           setError("");
//                           if (mobileView) setShowSidebar(false);
//                         }}
//                         className={`w-full p-3 text-left transition-colors border-b border-gray-700 ${
//                           selectedTeacher?._id === teacher._id
//                             ? "bg-blue-600/20 border-l-4 border-l-blue-500"
//                             : "hover:bg-gray-700"
//                         }`}
//                       >
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
//                             {teacher.name?.charAt(0) || "T"}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-white font-medium text-sm truncate">{teacher.name}</p>
//                             <div className="flex items-center gap-2">
//                               <p className="text-xs text-gray-400 truncate">{teacher.subject || "Teacher"}</p>
//                               {isLowOnMessages && limits && (
//                                 <span className="text-xs text-yellow-500">
//                                   ⚠️ {limits.daily.remaining} left
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Chat Area */}
//           {(!mobileView || !showSidebar) && (
//             <div className="flex-1 flex flex-col">
//               {selectedTeacher ? (
//                 <>
//                   {/* Chat Header */}
//                   <div className="bg-gray-800 border-b border-gray-700 p-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
//                           {selectedTeacher.name?.charAt(0) || "T"}
//                         </div>
//                         <div>
//                           <h3 className="text-white font-medium">{selectedTeacher.name}</h3>
//                           <p className="text-xs text-gray-400">{selectedTeacher.subject || "Teacher"}</p>
//                         </div>
//                       </div>
                      
//                       {/* Teacher Limits Badge */}
//                       {teacherLimits[selectedTeacher._id] && (
//                         <div className="text-right">
//                           <p className="text-xs text-gray-400">
//                             📨 {teacherLimits[selectedTeacher._id].daily?.remaining || 0} msgs left today
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Messages Area */}
//                   <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                     {messages.length === 0 ? (
//                       <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                         <MessageSquare size={48} className="mb-3 opacity-30" />
//                         <p>No messages yet</p>
//                         <p className="text-sm">Send a message to start the conversation</p>
//                       </div>
//                     ) : (
//                       messages.map((msg, idx) => {
//                         const isAdmin = isAdminMessage(msg);
//                         return (
//                           <div
//                             key={msg._id || idx}
//                             className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
//                           >
//                             <div className={`max-w-[70%] rounded-lg px-3 py-2 ${getMessageStyle(msg)}`}>
//                               {/* Header with icon */}
//                               <div className="flex items-center gap-1 mb-1 text-xs opacity-80">
//                                 {getMessageIcon(msg)}
//                                 <span>
//                                   {isAdmin ? "You" : 
//                                    msg.isAutoReply ? "Auto-Reply" :
//                                    msg.isSystemMessage ? "System" :
//                                    selectedTeacher.name}
//                                 </span>
//                                 {msg.isPending && <Clock size={10} className="ml-1" />}
//                               </div>
//                               {/* Message text */}
//                               <p className="text-sm whitespace-pre-wrap break-words">
//                                 {msg.text}
//                               </p>
//                               {/* Footer */}
//                               <div className="flex justify-end items-center gap-1 mt-1">
//                                 <span className="text-xs opacity-70">
//                                   {formatTime(msg.createdAt)}
//                                 </span>
//                                 {isAdmin && !msg.isPending && (
//                                   <CheckCheck size={12} className={msg.isRead ? "text-blue-300" : "text-gray-400"} />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                     {sending && (
//                       <div className="flex justify-end">
//                         <div className="bg-gray-700 rounded-lg px-3 py-2">
//                           <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
//                         </div>
//                       </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Input Area */}
//                   <form onSubmit={sendMessage} className="bg-gray-800 border-t border-gray-700 p-3">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder={isLocked ? "Chat is locked..." : "Type a message..."}
//                         disabled={sending || isLocked}
//                         className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 text-sm"
//                       />
//                       <button
//                         type="submit"
//                         disabled={!newMessage.trim() || sending || isLocked}
//                         className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50"
//                       >
//                         <Send size={16} />
//                       </button>
//                     </div>
//                   </form>
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="text-center text-gray-500">
//                     <Users size={64} className="mb-4 opacity-30 mx-auto" />
//                     <p className="text-lg font-medium">No conversation selected</p>
//                     <p className="text-sm">Choose a teacher from the sidebar to start messaging</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Lock Dialog Modal */}
//       {showLockDialog && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4">
//             <div className="text-center mb-4">
//               {isLocked ? (
//                 <Lock size={48} className="mx-auto mb-3 text-yellow-500" />
//               ) : (
//                 <Unlock size={48} className="mx-auto mb-3 text-green-500" />
//               )}
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 {isLocked ? "Unlock Chat?" : "Lock Chat?"}
//               </h3>
//               <p className="text-gray-400">
//                 {isLocked 
//                   ? "Teachers will be able to send messages again."
//                   : "Teachers will not be able to send any messages until you unlock it."}
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowLockDialog(false)}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={toggleLock}
//                 className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
//                   isLocked 
//                     ? "bg-green-600 hover:bg-green-700" 
//                     : "bg-red-600 hover:bg-red-700"
//                 }`}
//               >
//                 {isLocked ? "Yes, Unlock" : "Yes, Lock"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

















"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Send, 
  Lock, 
  Unlock,
  User, 
  CheckCheck, 
  Clock, 
  Loader2,
  RefreshCw,
  Users,
  ArrowLeft,
  Bot,
  AlertCircle,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  useTeachersList, 
  useChatHistory, 
  useSendMessage, 
  useToggleChatLock 
} from "@/hooks/useAdminQueries";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [showLockDialog, setShowLockDialog] = useState(false);
  
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  // ✅ Get admin info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    
    console.log("Auth Check:", { token: !!token, userRole, userId });
    
    if (!token || userRole !== "admin") {
      router.push("/login");
      return;
    }
    
    setAdminId(userId);
  }, [router]);

  // React Query hooks
  const { 
    data: teachersData, 
    isLoading: teachersLoading, 
    refetch: refetchTeachers,
    isFetching: isFetchingTeachers
  } = useTeachersList(adminId);
  
  const { 
    data: chatData, 
    isLoading: chatLoading,
    refetch: refetchChat
  } = useChatHistory(adminId, selectedTeacher?._id);
  
  const sendMessageMutation = useSendMessage();
  const toggleLockMutation = useToggleChatLock();

  const teachers = teachersData?.teachers || [];
  const isLocked = teachersData?.isLocked || false;
  const messages = chatData?.data || [];
  const teacherLimits = chatData?.limits || {};

  // Check screen size for mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      if (isMobile && selectedTeacher) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [selectedTeacher]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ✅ Toggle Chat Lock
  const handleToggleLock = () => {
    toggleLockMutation.mutate(!isLocked, {
      onSuccess: (data) => {
        setShowLockDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || "Failed to toggle chat lock");
      }
    });
  };

  // ✅ Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeacher) return;

    const tempMessage = {
      _id: Date.now(),
      sender: adminId,
      receiver: selectedTeacher._id,
      text: newMessage.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      isPending: true
    };

    // Optimistic update
    // We'll let the hook handle the actual send
    sendMessageMutation.mutate({
      sender: adminId,
      receiver: selectedTeacher._id,
      text: newMessage.trim()
    }, {
      onSuccess: () => {
        setNewMessage("");
        refetchChat();
      }
    });
  };

  // Polling for new messages
  useEffect(() => {
    if (selectedTeacher && adminId) {
      refetchChat();
      pollingInterval.current = setInterval(refetchChat, 5000);
      return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      };
    }
  }, [selectedTeacher, adminId, refetchChat]);

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

  // Check if message is from admin
  const isAdminMessage = (msg) => {
    return msg.sender === adminId;
  };

  // Get message style
  const getMessageStyle = (msg) => {
    const isAdmin = isAdminMessage(msg);
    const isAuto = msg.isAutoReply;
    
    if (isAdmin) {
      return "bg-blue-600 text-white";
    }
    if (isAuto) {
      return "bg-purple-600/30 border border-purple-500/50 text-white";
    }
    return "bg-gray-700 text-white";
  };

  // Get message icon
  const getMessageIcon = (msg) => {
    const isAdmin = isAdminMessage(msg);
    const isAuto = msg.isAutoReply;
    const isSystem = msg.isSystemMessage;
    
    if (isAuto && !isAdmin) return <Bot size={12} className="text-purple-400 mr-1" />;
    if (isSystem) return <AlertCircle size={12} className="text-yellow-400 mr-1" />;
    if (isAdmin) return <User size={12} className="text-blue-300 mr-1" />;
    return null;
  };

  // Loading state
  if (teachersLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-blue-500" size={24} />
              <div>
                <h1 className="text-lg font-bold text-white">Messages</h1>
                <p className="text-xs text-gray-400">
                  {isLocked ? "🔒 Chat is locked" : "💬 Chat with teachers"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Lock/Unlock Button */}
              <button
                onClick={() => setShowLockDialog(true)}
                disabled={toggleLockMutation.isPending}
                className={`p-2 rounded-lg transition-colors ${
                  isLocked 
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                } disabled:opacity-50`}
                title={isLocked ? "Chat is locked - Click to unlock" : "Chat is open - Click to lock"}
              >
                {toggleLockMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isLocked ? (
                  <Lock size={18} />
                ) : (
                  <Unlock size={18} />
                )}
              </button>
              
              {mobileView && selectedTeacher && (
                <button
                  onClick={() => {
                    setShowSidebar(true);
                    setSelectedTeacher(null);
                  }}
                  className="px-3 py-1.5 bg-gray-700 rounded-lg text-white text-sm flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              
              {!mobileView && (
                <button
                  onClick={() => refetchTeachers()}
                  disabled={isFetchingTeachers}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={18} className={`text-gray-400 ${isFetchingTeachers ? "animate-spin" : ""}`} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Teachers List */}
          {(showSidebar || !mobileView) && (
            <div className={`${mobileView ? 'w-full' : 'w-72'} border-r border-gray-700 flex flex-col`}>
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Users size={16} />
                  Teachers
                </h3>
                <p className="text-xs text-gray-500 mt-1">{teachers.length} teachers total</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {teachers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No teachers found</p>
                    <p className="text-xs mt-1">Add teachers first</p>
                  </div>
                ) : (
                  teachers.map((teacher) => {
                    const limits = teacherLimits[teacher._id];
                    const isLowOnMessages = limits?.daily?.remaining < 10;
                    
                    return (
                      <button
                        key={teacher._id}
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          if (mobileView) setShowSidebar(false);
                        }}
                        className={`w-full p-3 text-left transition-colors border-b border-gray-700 ${
                          selectedTeacher?._id === teacher._id
                            ? "bg-blue-600/20 border-l-4 border-l-blue-500"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {teacher.name?.charAt(0) || "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{teacher.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400 truncate">{teacher.subject || "Teacher"}</p>
                              {isLowOnMessages && limits && (
                                <span className="text-xs text-yellow-500">
                                  ⚠️ {limits.daily.remaining} left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          {(!mobileView || !showSidebar) && (
            <div className="flex-1 flex flex-col">
              {selectedTeacher ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-gray-800 border-b border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {selectedTeacher.name?.charAt(0) || "T"}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{selectedTeacher.name}</h3>
                          <p className="text-xs text-gray-400">{selectedTeacher.subject || "Teacher"}</p>
                        </div>
                      </div>
                      
                      {/* Teacher Limits Badge */}
                      {teacherLimits[selectedTeacher._id] && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            📨 {teacherLimits[selectedTeacher._id].daily?.remaining || 0} msgs left today
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageSquare size={48} className="mb-3 opacity-30" />
                        <p>No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isAdmin = isAdminMessage(msg);
                        return (
                          <div
                            key={msg._id || idx}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[70%] rounded-lg px-3 py-2 ${getMessageStyle(msg)}`}>
                              {/* Header with icon */}
                              <div className="flex items-center gap-1 mb-1 text-xs opacity-80">
                                {getMessageIcon(msg)}
                                <span>
                                  {isAdmin ? "You" : 
                                   msg.isAutoReply ? "Auto-Reply" :
                                   msg.isSystemMessage ? "System" :
                                   selectedTeacher.name}
                                </span>
                              </div>
                              {/* Message text */}
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>
                              {/* Footer */}
                              <div className="flex justify-end items-center gap-1 mt-1">
                                <span className="text-xs opacity-70">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isAdmin && (
                                  <CheckCheck size={12} className={msg.isRead ? "text-blue-300" : "text-gray-400"} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-end">
                        <div className="bg-gray-700 rounded-lg px-3 py-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={sendMessage} className="bg-gray-800 border-t border-gray-700 p-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isLocked ? "Chat is locked..." : "Type a message..."}
                        disabled={sendMessageMutation.isPending || isLocked}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sendMessageMutation.isPending || isLocked}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50"
                      >
                        {sendMessageMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                  </form>

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="bg-gray-800 rounded-xl p-6 text-center max-w-sm mx-4">
                        <Lock size={48} className="mx-auto mb-3 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-white mb-2">Chat is Locked</h3>
                        <p className="text-gray-400 text-sm">
                          Admin has temporarily disabled chat. You cannot send new messages.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Users size={64} className="mb-4 opacity-30 mx-auto" />
                    <p className="text-lg font-medium">No conversation selected</p>
                    <p className="text-sm">Choose a teacher from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lock Dialog Modal */}
      {showLockDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4">
            <div className="text-center mb-4">
              {isLocked ? (
                <Lock size={48} className="mx-auto mb-3 text-yellow-500" />
              ) : (
                <Unlock size={48} className="mx-auto mb-3 text-green-500" />
              )}
              <h3 className="text-xl font-semibold text-white mb-2">
                {isLocked ? "Unlock Chat?" : "Lock Chat?"}
              </h3>
              <p className="text-gray-400">
                {isLocked 
                  ? "Teachers will be able to send messages again."
                  : "Teachers will not be able to send any messages until you unlock it."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleLock}
                disabled={toggleLockMutation.isPending}
                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                  isLocked 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {toggleLockMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isLocked ? (
                  "Yes, Unlock"
                ) : (
                  "Yes, Lock"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}