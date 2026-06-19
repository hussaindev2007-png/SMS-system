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
  Calendar,
  Hash,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Mail,
  Phone,
  Award,
  Clock,
  BookOpen
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/services/apiClient";

const useTeacherIDCards = () => {
  return useQuery({
    queryKey: ["admin", "teacherIdCards"],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/teacher-id-card`);
      return response.data;
    },
  });
};

export default function TeacherIDCardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useTeacherIDCards();
  
  const cards = data?.data || [];

  // Filter cards
  const filteredCards = cards.filter(card => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      card.teacher?.name?.toLowerCase().includes(term) ||
      card.teacher?.email?.toLowerCase().includes(term) ||
      card.cardNumber?.toLowerCase().includes(term) ||
      card.teacherCode?.toLowerCase().includes(term)
    );
  });

  // Stats
  const activeCards = cards.filter(c => new Date(c.expiryDate) > new Date()).length;
  const expiredCards = cards.filter(c => new Date(c.expiryDate) <= new Date()).length;

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
          <title>Teacher ID Card - ${card.teacher?.name}</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; font-family: Arial, sans-serif; }
            .id-card { width: 350px; background: linear-gradient(135deg, #6b21a5 0%, #4c1d95 100%); border-radius: 16px; padding: 20px; color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .school-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px; margin-bottom: 15px; }
            .photo-section { text-align: center; margin-bottom: 15px; }
            .teacher-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid gold; }
            .info-row { margin-bottom: 8px; font-size: 12px; }
            .label { font-weight: bold; opacity: 0.8; }
            .qr-code { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3); }
            .qr-code img { width: 80px; height: 80px; }
            @media print { body { background: white; padding: 0; } .id-card { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="school-header"><div style="font-size:18px;font-weight:bold;">School Management System</div><div style="font-size:10px;">Teacher Identity Card</div></div>
            <div class="photo-section">${card.teacher?.photoUrl ? `<img src="${card.teacher.photoUrl}" class="teacher-photo" alt="Photo">` : '<div style="width:100px;height:100px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:40px;">&#x1F468;&#x200D;&#x1F3EB;</div>'}</div>
            <div class="info-row"><span class="label">Name:</span> ${card.teacher?.name || 'N/A'}</div>
            <div class="info-row"><span class="label">Teacher Code:</span> ${card.teacherCode || 'N/A'}</div>
            <div class="info-row"><span class="label">Qualification:</span> ${card.teacher?.qualification || 'N/A'}</div>
            <div class="info-row"><span class="label">Card No:</span> ${card.cardNumber}</div>
            <div class="info-row"><span class="label">Valid Till:</span> ${new Date(card.expiryDate).toLocaleDateString()}</div>
            <div class="qr-code"><img src="${card.qrCodeData}" alt="QR"><div style="font-size:8px;margin-top:5px;">Scan to Verify</div></div>
          </div>
          <script>window.print();setTimeout(()=>window.close(),1000);</script>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      toast.dismiss(loadingToast);
      toast.success("Card downloaded!");
    } catch (error) {
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
      <!DOCTYPE html><html><head><title>All Teacher ID Cards</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; margin: 0; }
        .cards-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .id-card { background: linear-gradient(135deg, #6b21a5 0%, #4c1d95 100%); border-radius: 16px; padding: 20px; color: white; break-inside: avoid; }
        .school-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 10px; }
        .photo-section { text-align: center; margin: 10px 0; }
        .teacher-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
        .info-row { margin: 4px 0; font-size: 11px; }
        @media print { body { background: white; } .cards-container { gap: 15px; } }
      </style></head><body><div class="cards-container">
    `;
    
    filteredCards.forEach(card => {
      htmlContent += `
        <div class="id-card">
          <div class="school-header"><div style="font-size:16px;font-weight:bold;">School Management System</div><div style="font-size:10px;">Teacher ID Card</div></div>
          <div class="photo-section">${card.teacher?.photoUrl ? `<img src="${card.teacher.photoUrl}" class="teacher-photo">` : '<div style="width:80px;height:80px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:30px;">&#x1F468;&#x200D;&#x1F3EB;</div>'}</div>
          <div class="info-row"><strong>Name:</strong> ${card.teacher?.name || 'N/A'}</div>
          <div class="info-row"><strong>Code:</strong> ${card.teacherCode}</div>
          <div class="info-row"><strong>Qualification:</strong> ${card.teacher?.qualification || 'N/A'}</div>
          <div class="info-row"><strong>Card No:</strong> ${card.cardNumber}</div>
        </div>
      `;
    });
    
    htmlContent += '</div><script>window.print();</script></body></html>';
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.dismiss(loadingToast);
    toast.success(`Printed ${filteredCards.length} cards!`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
          <Clock size={10} /> Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
        <CheckCircle size={10} /> Active
      </span>
    );
  };

  const handleRefresh = () => { refetch(); toast.success("Data refreshed!"); };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading teacher ID cards...</p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Error loading ID cards</p>
          <p className="text-gray-500 text-sm mt-2">{error?.message || "Please try again"}</p>
          <button onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors cursor-pointer text-sm font-medium">
            <RefreshCw size={16} className="inline mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <IdCard className="text-purple-600" size={28} />
                Teacher ID Cards
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage and download teacher identity cards</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} disabled={isFetching}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50" title="Refresh">
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
              </button>
              <button onClick={handlePrintAll} disabled={filteredCards.length === 0}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
                <Printer size={16} /> Print All ({filteredCards.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Total Cards</p><p className="text-2xl font-bold text-gray-900">{cards.length}</p></div>
              <IdCard size={28} className="text-purple-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Active</p><p className="text-2xl font-bold text-emerald-600">{activeCards}</p></div>
              <CheckCircle size={28} className="text-emerald-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Expired</p><p className="text-2xl font-bold text-red-500">{expiredCards}</p></div>
              <Clock size={28} className="text-red-500 opacity-40" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, email, code or card number..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-text" />
          </div>
          {searchTerm && (
            <button onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">
              <X size={14} /> Clear search
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <IdCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No teacher ID cards found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Try changing your search" : "Generate ID cards for approved teachers"}
            </p>
          </div>
        )}

        {/* Table */}
        {filteredCards.length > 0 && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualification</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Number</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedCards.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {card.teacher?.photoUrl ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={card.teacher.photoUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <User size={18} className="text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{card.teacher?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail size={10} /> {card.teacher?.email || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-mono text-gray-700">{card.teacherCode || 'N/A'}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Award size={12} className="text-gray-400" />
                            <span>{card.teacher?.qualification || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-mono text-gray-600">{card.cardNumber}</td>
                        <td className="p-4">{getStatusBadge(card.expiryDate)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedCard(card); setShowPreviewModal(true); }}
                              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
                              <Eye size={14} /> Preview
                            </button>
                            <button onClick={() => handleDownloadCard(card)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
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
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-700 font-medium px-3">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
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
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Teacher ID Card</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedCard.teacher?.name}</p>
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 text-white">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/30">
                      {selectedCard.teacher?.photoUrl ? (
                        <img src={selectedCard.teacher.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center">
                          <User size={32} className="text-white/60" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{selectedCard.teacher?.name}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    {[
                      { label: "Card Number", value: selectedCard.cardNumber, icon: IdCard },
                      { label: "Teacher Code", value: selectedCard.teacherCode, icon: Hash },
                      { label: "Qualification", value: selectedCard.teacher?.qualification, icon: Award },
                      { label: "Email", value: selectedCard.teacher?.email, icon: Mail },
                      { label: "Phone", value: selectedCard.teacher?.phone, icon: Phone },
                      { label: "Valid Until", value: formatDate(selectedCard.expiryDate), icon: Calendar },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/20 last:border-0">
                        <span className="opacity-70 flex items-center gap-1.5">
                          <item.icon size={12} /> {item.label}
                        </span>
                        <span className="text-right max-w-[60%] truncate">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>

                  {selectedCard.qrCodeData && (
                    <div className="flex justify-center mt-4 pt-4 border-t border-white/20">
                      <img src={selectedCard.qrCodeData} alt="QR" className="w-24 h-24 bg-white p-2 rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowPreviewModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Close</button>
                  <button onClick={() => { handleDownloadCard(selectedCard); setShowPreviewModal(false); }}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
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