// "use client";

// import { useState, useEffect } from "react";
// import { 
//   IdCard, 
//   Search, 
//   Filter, 
//   Download, 
//   Printer,
//   Loader2,
//   Users,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   School,
//   Calendar,
//   Hash,
//   User,
//   GraduationCap,
//   CheckCircle,
//   XCircle
// } from "lucide-react";

// export default function AdminIDCardsPage() {
//   const [cards, setCards] = useState([]);
//   const [filteredCards, setFilteredCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch all ID Cards
//   const fetchIDCards = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/id-cards");
//       const data = await res.json();
//       if (data.success) {
//         setCards(data.data);
//         setFilteredCards(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching ID cards:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIDCards();
//   }, []);

//   // Filter cards
//   useEffect(() => {
//     let filtered = cards;
    
//     // Filter by class
//     if (selectedClass) {
//       filtered = filtered.filter(card => 
//         card.className?.toLowerCase() === selectedClass.toLowerCase()
//       );
//     }
    
//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(card => 
//         card.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         card.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         card.cardNumber?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredCards(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedClass, cards]);

//   // Get unique classes for filter
//   const uniqueClasses = [...new Set(cards.map(card => card.className).filter(Boolean))];

//   // Pagination
//   const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
//   const paginatedCards = filteredCards.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Handle Download Card
//   const handleDownloadCard = async (card) => {
//     try {
//       // Create a printable version
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>ID Card - ${card.studentId?.name}</title>
//           <style>
//             body {
//               margin: 0;
//               padding: 20px;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               min-height: 100vh;
//               background: #f0f0f0;
//               font-family: Arial, sans-serif;
//             }
//             .id-card {
//               width: 350px;
//               background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
//               border-radius: 16px;
//               padding: 20px;
//               color: white;
//               box-shadow: 0 10px 40px rgba(0,0,0,0.2);
//             }
//             .school-header {
//               text-align: center;
//               border-bottom: 1px solid rgba(255,255,255,0.3);
//               padding-bottom: 10px;
//               margin-bottom: 15px;
//             }
//             .school-name {
//               font-size: 18px;
//               font-weight: bold;
//             }
//             .photo-section {
//               display: flex;
//               justify-content: center;
//               margin-bottom: 15px;
//             }
//             .student-photo {
//               width: 100px;
//               height: 100px;
//               border-radius: 50%;
//               background: white;
//               object-fit: cover;
//               border: 3px solid gold;
//             }
//             .info-row {
//               margin-bottom: 8px;
//               font-size: 12px;
//             }
//             .label {
//               font-weight: bold;
//               opacity: 0.8;
//             }
//             .qr-code {
//               text-align: center;
//               margin-top: 15px;
//               padding-top: 10px;
//               border-top: 1px solid rgba(255,255,255,0.3);
//             }
//             .qr-code img {
//               width: 80px;
//               height: 80px;
//             }
//             @media print {
//               body {
//                 background: white;
//                 padding: 0;
//                 margin: 0;
//               }
//               .id-card {
//                 box-shadow: none;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="id-card">
//             <div class="school-header">
//               <div class="school-name">🏫 School Management System</div>
//               <div style="font-size: 10px;">Student Identity Card</div>
//             </div>
//             <div class="photo-section">
//               ${card.photoUrl ? 
//                 `<img src="${card.photoUrl}" class="student-photo" alt="Photo">` :
//                 `<div style="width:100px;height:100px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;font-size:40px;">📷</div>`
//               }
//             </div>
//             <div class="info-row">
//               <span class="label">Name:</span> ${card.studentId?.name || 'N/A'}
//             </div>
//             <div class="info-row">
//               <span class="label">Father Name:</span> ${card.studentId?.fatherName || 'N/A'}
//             </div>
//             <div class="info-row">
//               <span class="label">Roll No:</span> ${card.rollNumber || card.studentId?.rollNo || 'N/A'}
//             </div>
//             <div class="info-row">
//               <span class="label">Class:</span> ${card.className || card.studentId?.className || 'N/A'} - ${card.studentId?.section || ''}
//             </div>
//             <div class="info-row">
//               <span class="label">Card No:</span> ${card.cardNumber}
//             </div>
//             <div class="info-row">
//               <span class="label">Valid Till:</span> ${new Date(card.expiryDate).toLocaleDateString()}
//             </div>
//             <div class="qr-code">
//               <img src="${card.qrCodeData}" alt="QR Code">
//               <div style="font-size: 8px; margin-top: 5px;">Scan to Verify</div>
//             </div>
//           </div>
//           <script>
//             window.print();
//             setTimeout(() => window.close(), 1000);
//           </script>
//         </body>
//         </html>
//       `);
//       printWindow.document.close();
//     } catch (error) {
//       console.error("Error downloading card:", error);
//       alert("Failed to download card");
//     }
//   };

//   // Handle Print All
//   const handlePrintAll = () => {
//     const printWindow = window.open('', '_blank');
//     let htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>All ID Cards</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             padding: 20px;
//             background: #f0f0f0;
//           }
//           .cards-container {
//             display: grid;
//             grid-template-columns: repeat(2, 1fr);
//             gap: 20px;
//           }
//           .id-card {
//             width: 350px;
//             background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
//             border-radius: 16px;
//             padding: 20px;
//             color: white;
//             box-shadow: 0 5px 20px rgba(0,0,0,0.1);
//             break-inside: avoid;
//             margin-bottom: 20px;
//           }
//           /* Rest of styles same as above */
//         </style>
//       </head>
//       <body>
//         <div class="cards-container">
//     `;
    
//     filteredCards.forEach(card => {
//       htmlContent += `
//         <div class="id-card">
//           <div class="school-header">
//             <div>🏫 School Management System</div>
//             <div style="font-size: 10px;">Student Identity Card</div>
//           </div>
//           <div class="photo-section">
//             ${card.photoUrl ? 
//               `<img src="${card.photoUrl}" class="student-photo" style="width:80px;height:80px;border-radius:50%;">` :
//               '<div style="font-size:30px;">📷</div>'
//             }
//           </div>
//           <div><strong>Name:</strong> ${card.studentId?.name}</div>
//           <div><strong>Roll No:</strong> ${card.rollNumber}</div>
//           <div><strong>Card No:</strong> ${card.cardNumber}</div>
//         </div>
//       `;
//     });
    
//     htmlContent += `
//         </div>
//         <script>window.print();</script>
//       </body>
//       </html>
//     `;
    
//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get status badge
//   const getStatusBadge = (expiryDate) => {
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     if (expiry < today) {
//       return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Expired</span>;
//     }
//     return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>;
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <IdCard className="text-blue-500" size={28} />
//               Student ID Cards
//             </h1>
//             <p className="text-gray-400 mt-1">Manage and download student identity cards</p>
//           </div>
//           <button
//             onClick={handlePrintAll}
//             className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2"
//           >
//             <Printer size={18} />
//             Print All ({filteredCards.length})
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-gray-800 rounded-xl p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, roll number or card number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <div className="w-full md:w-64 relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//             >
//               <option value="">All Classes</option>
//               {uniqueClasses.map(className => (
//                 <option key={className} value={className}>{className}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Total ID Cards</p>
//               <p className="text-2xl font-bold text-white">{cards.length}</p>
//             </div>
//             <IdCard size={32} className="text-blue-500 opacity-50" />
//           </div>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Active Cards</p>
//               <p className="text-2xl font-bold text-white">
//                 {cards.filter(c => new Date(c.expiryDate) > new Date()).length}
//               </p>
//             </div>
//             <CheckCircle size={32} className="text-green-500 opacity-50" />
//           </div>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Total Classes</p>
//               <p className="text-2xl font-bold text-white">{uniqueClasses.length}</p>
//             </div>
//             <School size={32} className="text-purple-500 opacity-50" />
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//           <span className="ml-3 text-gray-400">Loading ID cards...</span>
//         </div>
//       ) : filteredCards.length === 0 ? (
//         <div className="bg-gray-800 rounded-xl p-12 text-center">
//           <IdCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-400">No ID cards found</p>
//           <p className="text-gray-500 text-sm mt-2">
//             {searchTerm || selectedClass ? "Try changing your filters" : "Approve student admissions to generate ID cards"}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* ID Cards Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {paginatedCards.map((card) => (
//               <div
//                 key={card._id}
//                 className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
//               >
//                 {/* Card Header */}
//                 <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <IdCard size={18} className="text-white" />
//                     <span className="text-white font-medium text-sm">{card.cardNumber}</span>
//                   </div>
//                   {getStatusBadge(card.expiryDate)}
//                 </div>

//                 {/* Card Body */}
//                 <div className="p-4">
//                   <div className="flex gap-4">
//                     {/* Photo */}
//                     <div className="flex-shrink-0">
//                       {card.photoUrl ? (
//                         <img
//                           src={card.photoUrl}
//                           alt={card.studentId?.name}
//                           className="w-20 h-20 rounded-xl object-cover bg-gray-700"
//                         />
//                       ) : (
//                         <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                           <User size={32} className="text-white" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1">
//                       <h3 className="text-white font-semibold">{card.studentId?.name || 'N/A'}</h3>
//                       <p className="text-gray-400 text-sm">{card.studentId?.fatherName || 'N/A'}</p>
//                       <div className="mt-2 space-y-1">
//                         <div className="flex items-center gap-2 text-gray-400 text-xs">
//                           <Hash size={12} />
//                           <span>Roll: {card.rollNumber || card.studentId?.rollNo}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-400 text-xs">
//                           <GraduationCap size={12} />
//                           <span>Class: {card.className || card.studentId?.className}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-400 text-xs">
//                           <Calendar size={12} />
//                           <span>Valid: {formatDate(card.expiryDate)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* QR Code */}
//                   {card.qrCodeData && (
//                     <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
//                       <div className="flex items-center gap-2">
//                         <img src={card.qrCodeData} alt="QR" className="w-10 h-10" />
//                         <span className="text-gray-500 text-xs">Scan to verify</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 flex gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedCard(card);
//                       setShowPreviewModal(true);
//                     }}
//                     className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm flex items-center justify-center gap-1"
//                   >
//                     <Eye size={14} /> Preview
//                   </button>
//                   <button
//                     onClick={() => handleDownloadCard(card)}
//                     className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center justify-center gap-1"
//                   >
//                     <Download size={14} /> Download
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-8">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
//               >
//                 <ChevronLeft size={18} className="text-white" />
//               </button>
//               <span className="text-gray-400">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
//               >
//                 <ChevronRight size={18} className="text-white" />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Preview Modal */}
//       {showPreviewModal && selectedCard && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="max-w-md w-full">
//             <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 shadow-2xl">
//               <div className="text-center mb-4">
//                 <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-white">
//                   {selectedCard.photoUrl ? (
//                     <img src={selectedCard.photoUrl} alt="" className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl">
//                       📷
//                     </div>
//                   )}
//                 </div>
//                 <h2 className="text-xl font-bold text-white">{selectedCard.studentId?.name}</h2>
//                 <p className="text-blue-200 text-sm">ID Card Preview</p>
//               </div>

//               <div className="space-y-2 text-white text-sm">
//                 <div className="flex justify-between border-b border-white/20 pb-2">
//                   <span className="opacity-70">Card Number:</span>
//                   <span className="font-mono">{selectedCard.cardNumber}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-white/20 pb-2">
//                   <span className="opacity-70">Roll Number:</span>
//                   <span>{selectedCard.rollNumber}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-white/20 pb-2">
//                   <span className="opacity-70">Class:</span>
//                   <span>{selectedCard.className}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-white/20 pb-2">
//                   <span className="opacity-70">Valid Until:</span>
//                   <span>{formatDate(selectedCard.expiryDate)}</span>
//                 </div>
//               </div>

//               {selectedCard.qrCodeData && (
//                 <div className="flex justify-center mt-4 pt-3 border-t border-white/20">
//                   <img src={selectedCard.qrCodeData} alt="QR" className="w-24 h-24" />
//                 </div>
//               )}

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowPreviewModal(false)}
//                   className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleDownloadCard(selectedCard);
//                     setShowPreviewModal(false);
//                   }}
//                   className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white flex items-center justify-center gap-2"
//                 >
//                   <Download size={16} /> Download
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

















"use client";

import { useState } from "react";
import { 
  IdCard, 
  Search, 
  Filter, 
  Download, 
  Printer,
  Loader2,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  School,
  Calendar,
  Hash,
  User,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/services/apiClient";

// Fetch ID cards hook
const useIDCards = (className = "") => {
  return useQuery({
    queryKey: ["admin", "idCards", className],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/id-cards`, {
        params: className ? { class: className } : {}
      });
      return response.data;
    },
  });
};

export default function AdminIDCardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useIDCards(selectedClass);
  
  const cards = data?.data || [];
  const availableClasses = data?.classes || [];

  // Filter cards by search term
  const filteredCards = cards.filter(card => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      card.studentId?.name?.toLowerCase().includes(term) ||
      card.rollNumber?.toLowerCase().includes(term) ||
      card.cardNumber?.toLowerCase().includes(term) ||
      card.studentId?.fatherName?.toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Download Card
  const handleDownloadCard = async (card) => {
    try {
      const loadingToast = toast.loading("Preparing card...");
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ID Card - ${card.studentId?.name}</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; font-family: Arial, sans-serif; }
            .id-card { width: 350px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 16px; padding: 20px; color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .school-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px; margin-bottom: 15px; }
            .school-name { font-size: 18px; font-weight: bold; }
            .photo-section { display: flex; justify-content: center; margin-bottom: 15px; }
            .student-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid gold; }
            .info-row { margin-bottom: 8px; font-size: 12px; }
            .label { font-weight: bold; opacity: 0.8; }
            .qr-code { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3); }
            .qr-code img { width: 80px; height: 80px; }
            @media print { body { background: white; padding: 0; } .id-card { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="school-header">
              <div class="school-name">🏫 School Management System</div>
              <div style="font-size:10px;">Student Identity Card</div>
            </div>
            <div class="photo-section">
              ${card.studentId?.photoUrl ? `<img src="${card.studentId.photoUrl}" class="student-photo" alt="Photo">` : '<div style="width:100px;height:100px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;font-size:40px;">📷</div>'}
            </div>
            <div class="info-row"><span class="label">Name:</span> ${card.studentId?.name || 'N/A'}</div>
            <div class="info-row"><span class="label">Father Name:</span> ${card.studentId?.fatherName || 'N/A'}</div>
            <div class="info-row"><span class="label">Roll No:</span> ${card.rollNumber || card.studentId?.rollNo || 'N/A'}</div>
            <div class="info-row"><span class="label">Class:</span> ${card.className || card.studentId?.className || 'N/A'}${card.studentId?.section ? ' - ' + card.studentId.section : ''}</div>
            <div class="info-row"><span class="label">Card No:</span> ${card.cardNumber}</div>
            <div class="info-row"><span class="label">Valid Till:</span> ${new Date(card.expiryDate).toLocaleDateString()}</div>
            <div class="qr-code"><img src="${card.qrCodeData}" alt="QR" style="width:80px;height:80px;"><div style="font-size:8px;margin-top:5px;">Scan to Verify</div></div>
          </div>
          <script>window.print();setTimeout(()=>window.close(),1000);</script>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      toast.dismiss(loadingToast);
      toast.success("Card downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download card");
    }
  };

  // Handle Print All
  const handlePrintAll = () => {
    if (filteredCards.length === 0) {
      toast.error("No cards to print");
      return;
    }
    
    const loadingToast = toast.loading("Preparing all cards...");
    
    const printWindow = window.open('', '_blank');
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>All ID Cards</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; margin: 0; }
          .cards-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
          .id-card { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 16px; padding: 20px; color: white; break-inside: avoid; margin-bottom: 20px; }
          .school-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 10px; }
          .photo-section { text-align: center; margin: 10px 0; }
          .student-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
          .info-row { margin: 4px 0; font-size: 11px; }
          .info-row strong { opacity: 0.8; }
          @media print { body { background: white; } .cards-container { gap: 15px; } }
        </style>
      </head>
      <body>
        <div class="cards-container">
    `;
    
    filteredCards.forEach(card => {
      htmlContent += `
        <div class="id-card">
          <div class="school-header"><div style="font-size:16px;font-weight:bold;">🏫 School Management System</div><div style="font-size:10px;">Student Identity Card</div></div>
          <div class="photo-section">
            ${card.studentId?.photoUrl ? `<img src="${card.studentId.photoUrl}" class="student-photo">` : '<div style="width:80px;height:80px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:30px;">📷</div>'}
          </div>
          <div class="info-row"><strong>Name:</strong> ${card.studentId?.name || 'N/A'}</div>
          <div class="info-row"><strong>Roll No:</strong> ${card.rollNumber || card.studentId?.rollNo || 'N/A'}</div>
          <div class="info-row"><strong>Class:</strong> ${card.className || card.studentId?.className || 'N/A'}</div>
          <div class="info-row"><strong>Card No:</strong> ${card.cardNumber}</div>
          <div class="info-row"><strong>Valid Till:</strong> ${new Date(card.expiryDate).toLocaleDateString()}</div>
        </div>
      `;
    });
    
    htmlContent += `
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.dismiss(loadingToast);
    toast.success(`Printed ${filteredCards.length} cards!`);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status badge
  const getStatusBadge = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">Expired</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">Active</span>;
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setCurrentPage(1);
    toast.success("Filters cleared!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading ID cards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Error loading ID cards</p>
          <p className="text-gray-500 text-sm mt-2">{error?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors cursor-pointer text-sm font-medium"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <IdCard className="text-blue-600" size={28} />
                Student ID Cards
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage and download student identity cards</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
              </button>
              <button
                onClick={handlePrintAll}
                disabled={filteredCards.length === 0}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer size={16} />
                Print All ({filteredCards.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Cards</p>
                <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
              </div>
              <IdCard size={28} className="text-blue-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Active Cards</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cards.filter(c => new Date(c.expiryDate) > new Date()).length}
                </p>
              </div>
              <CheckCircle size={28} className="text-green-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
              </div>
              <Users size={28} className="text-blue-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Classes</p>
                <p className="text-2xl font-bold text-gray-900">{availableClasses.length}</p>
              </div>
              <School size={28} className="text-purple-500 opacity-40" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, father name, roll number or card number..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
              />
            </div>
            
         
            {/* Clear Filters Button */}
            {(searchTerm || selectedClass) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <IdCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No ID cards found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedClass ? "Try changing your filters" : "Approve student admissions to generate ID cards"}
            </p>
          </div>
        )}

        {/* ID Cards Table */}
        {filteredCards.length > 0 && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Number</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCards.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {card.studentId?.photoUrl ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={card.studentId.photoUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{card.studentId?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{card.studentId?.fatherName || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700 font-mono">{card.rollNumber || card.studentId?.rollNo || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{card.className || card.studentId?.className || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-gray-600">{card.cardNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(card.expiryDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedCard(card);
                                setShowPreviewModal(true);
                              }}
                              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Preview"
                            >
                              <Eye size={14} /> Preview
                            </button>
                            <button
                              onClick={() => handleDownloadCard(card)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Download"
                            >
                              <Download size={14} /> Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCards.length)} of {filteredCards.length} cards
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-700 font-medium px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">ID Card Preview</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedCard.studentId?.name}</p>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Card Preview */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-6 text-white">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/30">
                      {selectedCard.studentId?.photoUrl ? (
                        <img src={selectedCard.studentId.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center">
                          <User size={32} className="text-white/60" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{selectedCard.studentId?.name}</h3>
                    <p className="text-blue-200 text-xs">{selectedCard.studentId?.fatherName}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="opacity-70">Card Number</span>
                      <span className="font-mono text-xs">{selectedCard.cardNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="opacity-70">Roll Number</span>
                      <span>{selectedCard.rollNumber || selectedCard.studentId?.rollNo}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="opacity-70">Class</span>
                      <span>{selectedCard.className || selectedCard.studentId?.className}{selectedCard.studentId?.section ? ` - ${selectedCard.studentId.section}` : ''}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="opacity-70">Valid Until</span>
                      <span>{formatDate(selectedCard.expiryDate)}</span>
                    </div>
                  </div>

                  {selectedCard.qrCodeData && (
                    <div className="flex justify-center mt-4 pt-4 border-t border-white/20">
                      <img src={selectedCard.qrCodeData} alt="QR" className="w-24 h-24 bg-white p-2 rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadCard(selectedCard);
                      setShowPreviewModal(false);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}