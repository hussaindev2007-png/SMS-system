// "use client";

// import { useState, useEffect } from "react";
// import {
//   DollarSign,
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   Users,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Download,
//   Printer,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   FileText,
//   CreditCard,
//   AlertCircle,
//   School
// } from "lucide-react";

// export default function AdminFeesPage() {
//   const [fees, setFees] = useState([]);
//   const [filteredFees, setFilteredFees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedFee, setSelectedFee] = useState(null);
//   const [formData, setFormData] = useState({
//     rollNo: "",
//     month: "",
//     amount: "",
//     status: "unpaid",
//     feeType: "monthly"
//   });
//   const [bulkData, setBulkData] = useState({
//     month: "",
//     amount: "",
//     className: "",
//     feeType: "monthly"
//   });
//   const [formError, setFormError] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     totalPages: 1,
//     hasMore: false
//   });

//   const itemsPerPage = 10;

//   // Fetch fees with pagination
//   const fetchFees = async (page = 1) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/fees?page=${page}&limit=${itemsPerPage}`);
//       const data = await res.json();
//       if (data.success) {
//         setFees(data.data);
//         setFilteredFees(data.data);
//         setPagination(data.pagination);
//       }
//     } catch (error) {
//       console.error("Error fetching fees:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFees(currentPage);
//   }, [currentPage]);

//   // Filter fees
//   useEffect(() => {
//     let filtered = fees;
    
//     if (searchTerm) {
//       filtered = filtered.filter(fee => 
//         fee.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         fee.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         fee.className?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (selectedStatus) {
//       filtered = filtered.filter(fee => fee.status === selectedStatus);
//     }
    
//     setFilteredFees(filtered);
//   }, [searchTerm, selectedStatus, fees]);

//   // Add single fee
//   const handleAddFee = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     try {
//       const res = await fetch("/api/admin/fees", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setShowAddModal(false);
//         setFormData({ rollNo: "", month: "", amount: "", status: "unpaid", feeType: "monthly" });
//         fetchFees(currentPage);
//         alert("✅ Fee record added successfully!");
//       } else {
//         setFormError(data.message || "Failed to add fee");
//       }
//     } catch (error) {
//       setFormError("Network error. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Bulk generate fees
//   const handleBulkGenerate = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     try {
//       const res = await fetch("/api/admin/fees/bulk", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bulkData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setShowBulkModal(false);
//         setBulkData({ month: "", amount: "", className: "", feeType: "monthly" });
//         fetchFees(1);
//         alert(`✅ ${data.message}\nCreated: ${data.created || data.upsertedCount}`);
//       } else {
//         setFormError(data.message || "Failed to generate fees");
//       }
//     } catch (error) {
//       setFormError("Network error. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Update fee
//   const handleUpdateFee = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     try {
//       const res = await fetch(`/api/admin/fees/${selectedFee._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           month: selectedFee.month,
//           amount: selectedFee.amount,
//           status: selectedFee.status,
//           feeType: selectedFee.feeType,
//           className: selectedFee.className
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setShowEditModal(false);
//         setSelectedFee(null);
//         fetchFees(currentPage);
//         alert("✅ Fee record updated successfully!");
//       } else {
//         setFormError(data.message || "Failed to update fee");
//       }
//     } catch (error) {
//       setFormError("Network error. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Delete fee
//   const handleDeleteFee = async (id, studentName) => {
//     if (!confirm(`Are you sure you want to delete fee record for ${studentName}?`)) return;

//     try {
//       const res = await fetch(`/api/admin/fees/${id}`, {
//         method: "DELETE"
//       });

//       if (res.ok) {
//         fetchFees(currentPage);
//         alert("✅ Fee record deleted successfully!");
//       } else {
//         const data = await res.json();
//         alert(data.message || "Failed to delete fee");
//       }
//     } catch (error) {
//       alert("Network error. Please try again.");
//     }
//   };

//   // Mark as paid
//   const handleMarkAsPaid = async (fee) => {
//     try {
//       const res = await fetch(`/api/admin/fees/${fee._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...fee,
//           status: "paid",
//           paymentDate: new Date().toISOString()
//         })
//       });

//       if (res.ok) {
//         fetchFees(currentPage);
//         alert("✅ Fee marked as paid!");
//       }
//     } catch (error) {
//       alert("Failed to update status");
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "paid":
//         return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><CheckCircle size={10} /> Paid</span>;
//       case "unpaid":
//         return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1"><XCircle size={10} /> Unpaid</span>;
//       case "partial":
//         return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1"><Clock size={10} /> Partial</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">{status}</span>;
//     }
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

//   // Months for dropdown
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   const currentMonth = months[new Date().getMonth()] + " " + new Date().getFullYear();

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <DollarSign className="text-green-500" size={28} />
//               Fee Management
//             </h1>
//             <p className="text-gray-400 mt-1">Manage student fees and payment records</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2"
//             >
//               <Plus size={18} />
//               Add Single Fee
//             </button>
//             <button
//               onClick={() => setShowBulkModal(true)}
//               className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2"
//             >
//               <Users size={18} />
//               Bulk Generate
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Total Fees</p>
//               <p className="text-2xl font-bold text-white">{pagination.total}</p>
//             </div>
//             <DollarSign size={32} className="text-blue-500 opacity-50" />
//           </div>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Total Collected</p>
//               <p className="text-2xl font-bold text-green-400">
//                 ₨ {fees.filter(f => f.status === "paid").reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <CheckCircle size={32} className="text-green-500 opacity-50" />
//           </div>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Pending Amount</p>
//               <p className="text-2xl font-bold text-red-400">
//                 ₨ {fees.filter(f => f.status === "unpaid").reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <Clock size={32} className="text-red-500 opacity-50" />
//           </div>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Collection Rate</p>
//               <p className="text-2xl font-bold text-purple-400">
//                 {pagination.total > 0 
//                   ? Math.round((fees.filter(f => f.status === "paid").length / pagination.total) * 100)
//                   : 0}%
//               </p>
//             </div>
//             <School size={32} className="text-purple-500 opacity-50" />
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-gray-800 rounded-xl p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, roll number or class..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <div className="w-full md:w-48 relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="paid">Paid</option>
//               <option value="unpaid">Unpaid</option>
//               <option value="partial">Partial</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//           <span className="ml-3 text-gray-400">Loading fees...</span>
//         </div>
//       ) : filteredFees.length === 0 ? (
//         <div className="bg-gray-800 rounded-xl p-12 text-center">
//           <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-400">No fee records found</p>
//           <p className="text-gray-500 text-sm mt-2">
//             {searchTerm || selectedStatus ? "Try changing your filters" : "Click 'Bulk Generate' to create fee records"}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Fees Table */}
//           <div className="bg-gray-800 rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-700/50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Roll No</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Class</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Month</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-700">
//                   {filteredFees.map((fee) => (
//                     <tr key={fee._id} className="hover:bg-gray-700/50 transition-colors">
//                       <td className="px-4 py-3">
//                         <div>
//                           <p className="text-white font-medium">{fee.studentId?.name || "N/A"}</p>
//                           <p className="text-gray-500 text-xs">{fee.feeType}</p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-400">{fee.rollNo || fee.studentId?.rollNo}</td>
//                       <td className="px-4 py-3 text-gray-400">{fee.className}</td>
//                       <td className="px-4 py-3 text-gray-400">{fee.month}</td>
//                       <td className="px-4 py-3 text-white font-medium">₨ {fee.amount?.toLocaleString()}</td>
//                       <td className="px-4 py-3">{getStatusBadge(fee.status)}</td>
//                       <td className="px-4 py-3 text-gray-400 text-sm">
//                         {fee.dueDate ? formatDate(fee.dueDate) : "N/A"}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2">
//                           {fee.status !== "paid" && (
//                             <button
//                               onClick={() => handleMarkAsPaid(fee)}
//                               className="p-1.5 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors"
//                               title="Mark as Paid"
//                             >
//                               <CheckCircle size={16} />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               setSelectedFee(fee);
//                               setShowEditModal(true);
//                             }}
//                             className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
//                             title="Edit"
//                           >
//                             <Edit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteFee(fee._id, fee.studentId?.name)}
//                             className="p-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
//               >
//                 <ChevronLeft size={18} className="text-white" />
//               </button>
//               <span className="text-gray-400">
//                 Page {currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
//                 disabled={currentPage === pagination.totalPages}
//                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
//               >
//                 <ChevronRight size={18} className="text-white" />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Add Single Fee Modal */}
//       {showAddModal && (
//         <Modal title="Add Single Fee" onClose={() => setShowAddModal(false)}>
//           <form onSubmit={handleAddFee} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number *</label>
//               <input
//                 type="text"
//                 value={formData.rollNo}
//                 onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
//                 placeholder="e.g., 2024-001"
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
//               <select
//                 value={formData.month}
//                 onChange={(e) => setFormData({...formData, month: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               >
//                 <option value="">Select Month</option>
//                 {months.map(month => (
//                   <option key={month} value={`${month} ${new Date().getFullYear()}`}>
//                     {month} {new Date().getFullYear()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR) *</label>
//               <input
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
//                 placeholder="e.g., 5000"
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
//               <select
//                 value={formData.status}
//                 onChange={(e) => setFormData({...formData, status: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//               >
//                 <option value="unpaid">Unpaid</option>
//                 <option value="paid">Paid</option>
//                 <option value="partial">Partial</option>
//               </select>
//             </div>
//             {formError && <p className="text-red-400 text-sm">{formError}</p>}
//             <div className="flex gap-3 pt-4">
//               <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg flex items-center justify-center gap-2">
//                 {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Fee"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Bulk Generate Modal */}
//       {showBulkModal && (
//         <Modal title="Bulk Generate Fees" onClose={() => setShowBulkModal(false)}>
//           <form onSubmit={handleBulkGenerate} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
//               <select
//                 value={bulkData.month}
//                 onChange={(e) => setBulkData({...bulkData, month: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               >
//                 <option value="">Select Month</option>
//                 {months.map(month => (
//                   <option key={month} value={`${month} ${new Date().getFullYear()}`}>
//                     {month} {new Date().getFullYear()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR) *</label>
//               <input
//                 type="number"
//                 value={bulkData.amount}
//                 onChange={(e) => setBulkData({...bulkData, amount: e.target.value})}
//                 placeholder="e.g., 5000"
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Class (Optional)</label>
//               <input
//                 type="text"
//                 value={bulkData.className}
//                 onChange={(e) => setBulkData({...bulkData, className: e.target.value})}
//                 placeholder="Leave empty for all classes"
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//               />
//               <p className="text-gray-500 text-xs mt-1">Leave empty to generate for all classes</p>
//             </div>
//             {formError && <p className="text-red-400 text-sm">{formError}</p>}
//             <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
//               <p className="text-blue-400 text-sm flex items-center gap-2">
//                 <AlertCircle size={14} />
//                 This will generate fee records for all active students
//               </p>
//             </div>
//             <div className="flex gap-3 pt-4">
//               <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-purple-600 rounded-lg flex items-center justify-center gap-2">
//                 {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Fees"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Edit Fee Modal */}
//       {showEditModal && selectedFee && (
//         <Modal title="Edit Fee Record" onClose={() => setShowEditModal(false)}>
//           <form onSubmit={handleUpdateFee} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
//               <input
//                 type="text"
//                 value={selectedFee.studentId?.name || "N/A"}
//                 disabled
//                 className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Month</label>
//               <input
//                 type="text"
//                 value={selectedFee.month}
//                 onChange={(e) => setSelectedFee({...selectedFee, month: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
//               <input
//                 type="number"
//                 value={selectedFee.amount}
//                 onChange={(e) => setSelectedFee({...selectedFee, amount: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
//               <select
//                 value={selectedFee.status}
//                 onChange={(e) => setSelectedFee({...selectedFee, status: e.target.value})}
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
//               >
//                 <option value="unpaid">Unpaid</option>
//                 <option value="paid">Paid</option>
//                 <option value="partial">Partial</option>
//               </select>
//             </div>
//             {formError && <p className="text-red-400 text-sm">{formError}</p>}
//             <div className="flex gap-3 pt-4">
//               <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg flex items-center justify-center gap-2">
//                 {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Fee"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Modal Component
// function Modal({ title, children, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-700">
//           <h2 className="text-xl font-bold text-white">{title}</h2>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }


















// // "use client";

// // import { useState } from "react";
// // import {
// //   DollarSign,
// //   Search,
// //   Filter,
// //   Plus,
// //   Edit,
// //   Trash2,
// //   Loader2,
// //   Users,
// //   Calendar,
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   ChevronLeft,
// //   ChevronRight,
// //   CreditCard,
// //   AlertCircle,
// //   School,
// //   RefreshCw
// // } from "lucide-react";
// // import { useFees, useAddFee, useBulkGenerateFees, useUpdateFee, useDeleteFee, useMarkFeeAsPaid } from "@/hooks/useAdminQueries";
// // import toast from "react-hot-toast";

// // export default function AdminFeesPage() {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedStatus, setSelectedStatus] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [showBulkModal, setShowBulkModal] = useState(false);
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [selectedFee, setSelectedFee] = useState(null);
// //   const [formData, setFormData] = useState({
// //     rollNo: "",
// //     month: "",
// //     amount: "",
// //     status: "unpaid",
// //     feeType: "monthly"
// //   });
// //   const [bulkData, setBulkData] = useState({
// //     month: "",
// //     amount: "",
// //     className: "",
// //     feeType: "monthly"
// //   });
// //   const [formError, setFormError] = useState("");

// //   const itemsPerPage = 10;

// //   // React Query hooks
// //   const { data, isLoading, isError, error, refetch, isFetching } = useFees(currentPage);
// //   const addFeeMutation = useAddFee();
// //   const bulkGenerateMutation = useBulkGenerateFees();
// //   const updateFeeMutation = useUpdateFee();
// //   const deleteFeeMutation = useDeleteFee();
// //   const markAsPaidMutation = useMarkFeeAsPaid();

// //   const fees = data?.data || [];
// //   const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

// //   // Filter fees locally
// //   const filteredFees = fees.filter(fee => {
// //     if (searchTerm) {
// //       const term = searchTerm.toLowerCase();
// //       const matches = 
// //         fee.studentId?.name?.toLowerCase().includes(term) ||
// //         fee.rollNo?.toLowerCase().includes(term) ||
// //         fee.className?.toLowerCase().includes(term);
// //       if (!matches) return false;
// //     }
// //     if (selectedStatus && fee.status !== selectedStatus) return false;
// //     return true;
// //   });

// //   // Add single fee
// //   const handleAddFee = (e) => {
// //     e.preventDefault();
// //     setFormError("");

// //     addFeeMutation.mutate(formData, {
// //       onSuccess: () => {
// //         setShowAddModal(false);
// //         setFormData({ rollNo: "", month: "", amount: "", status: "unpaid", feeType: "monthly" });
// //         toast.success("Fee record added successfully!");
// //       },
// //       onError: (err) => {
// //         setFormError(err.response?.data?.message || "Failed to add fee");
// //       }
// //     });
// //   };

// //   // Bulk generate fees
// //   const handleBulkGenerate = (e) => {
// //     e.preventDefault();
// //     setFormError("");

// //     bulkGenerateMutation.mutate(bulkData, {
// //       onSuccess: (data) => {
// //         setShowBulkModal(false);
// //         setBulkData({ month: "", amount: "", className: "", feeType: "monthly" });
// //         toast.success(data.message || "Fees generated successfully!");
// //       },
// //       onError: (err) => {
// //         setFormError(err.response?.data?.message || "Failed to generate fees");
// //       }
// //     });
// //   };

// //   // Update fee
// //   const handleUpdateFee = (e) => {
// //     e.preventDefault();
// //     setFormError("");

// //     updateFeeMutation.mutate({
// //       id: selectedFee._id,
// //       data: {
// //         month: selectedFee.month,
// //         amount: selectedFee.amount,
// //         status: selectedFee.status,
// //         feeType: selectedFee.feeType,
// //         className: selectedFee.className
// //       }
// //     }, {
// //       onSuccess: () => {
// //         setShowEditModal(false);
// //         setSelectedFee(null);
// //         toast.success("Fee updated successfully!");
// //       },
// //       onError: (err) => {
// //         setFormError(err.response?.data?.message || "Failed to update fee");
// //       }
// //     });
// //   };

// //   // Delete fee
// //   const handleDeleteFee = (id, studentName) => {
// //     if (!confirm(`Are you sure you want to delete fee record for ${studentName}?`)) return;

// //     deleteFeeMutation.mutate(id, {
// //       onSuccess: () => {
// //         toast.success("Fee record deleted successfully!");
// //       }
// //     });
// //   };

// //   // Mark as paid
// //   const handleMarkAsPaid = (id) => {
// //     markAsPaidMutation.mutate(id, {
// //       onSuccess: () => {
// //         toast.success("Fee marked as paid!");
// //       }
// //     });
// //   };

// //   // Get status badge
// //   const getStatusBadge = (status) => {
// //     switch(status) {
// //       case "paid":
// //         return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><CheckCircle size={10} /> Paid</span>;
// //       case "unpaid":
// //         return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1"><XCircle size={10} /> Unpaid</span>;
// //       case "partial":
// //         return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1"><Clock size={10} /> Partial</span>;
// //       default:
// //         return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">{status}</span>;
// //     }
// //   };

// //   // Format date
// //   const formatDate = (date) => {
// //     if (!date) return "N/A";
// //     return new Date(date).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   // Months for dropdown
// //   const months = [
// //     "January", "February", "March", "April", "May", "June",
// //     "July", "August", "September", "October", "November", "December"
// //   ];

// //   // Calculate stats
// //   const totalCollected = fees.filter(f => f.status === "paid").reduce((sum, f) => sum + (f.amount || 0), 0);
// //   const pendingAmount = fees.filter(f => f.status === "unpaid").reduce((sum, f) => sum + (f.amount || 0), 0);
// //   const collectionRate = pagination.total > 0 
// //     ? Math.round((fees.filter(f => f.status === "paid").length / pagination.total) * 100)
// //     : 0;

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
// //         <div className="text-center">
// //           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
// //           <p className="text-gray-400">Loading fees...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (isError) {
// //     return (
// //       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
// //         <div className="text-center">
// //           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
// //           <p className="text-red-400 text-lg">Error loading fees</p>
// //           <p className="text-gray-400 text-sm">{error?.message || "Please try again"}</p>
// //           <button
// //             onClick={() => refetch()}
// //             className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
// //           >
// //             <RefreshCw size={16} className="inline mr-2" />
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-900 p-6">
// //       {/* Header */}
// //       <div className="mb-8">
// //         <div className="flex justify-between items-center flex-wrap gap-4">
// //           <div>
// //             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
// //               <DollarSign className="text-green-500" size={28} />
// //               Fee Management
// //             </h1>
// //             <p className="text-gray-400 mt-1">Manage student fees and payment records</p>
// //           </div>
// //           <div className="flex gap-3">
// //             <button
// //               onClick={() => refetch()}
// //               disabled={isFetching}
// //               className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2 transition-colors disabled:opacity-50"
// //             >
// //               <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
// //               Refresh
// //             </button>
// //             <button
// //               onClick={() => setShowAddModal(true)}
// //               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2"
// //             >
// //               <Plus size={18} />
// //               Add Single Fee
// //             </button>
// //             <button
// //               onClick={() => setShowBulkModal(true)}
// //               className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2"
// //             >
// //               <Users size={18} />
// //               Bulk Generate
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //         <div className="bg-gray-800 rounded-xl p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-400 text-sm">Total Fees</p>
// //               <p className="text-2xl font-bold text-white">{pagination.total}</p>
// //             </div>
// //             <DollarSign size={32} className="text-blue-500 opacity-50" />
// //           </div>
// //         </div>
// //         <div className="bg-gray-800 rounded-xl p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-400 text-sm">Total Collected</p>
// //               <p className="text-2xl font-bold text-green-400">₨ {totalCollected.toLocaleString()}</p>
// //             </div>
// //             <CheckCircle size={32} className="text-green-500 opacity-50" />
// //           </div>
// //         </div>
// //         <div className="bg-gray-800 rounded-xl p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-400 text-sm">Pending Amount</p>
// //               <p className="text-2xl font-bold text-red-400">₨ {pendingAmount.toLocaleString()}</p>
// //             </div>
// //             <Clock size={32} className="text-red-500 opacity-50" />
// //           </div>
// //         </div>
// //         <div className="bg-gray-800 rounded-xl p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-400 text-sm">Collection Rate</p>
// //               <p className="text-2xl font-bold text-purple-400">{collectionRate}%</p>
// //             </div>
// //             <School size={32} className="text-purple-500 opacity-50" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-gray-800 rounded-xl p-4 mb-6">
// //         <div className="flex flex-col md:flex-row gap-4">
// //           <div className="flex-1 relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
// //             <input
// //               type="text"
// //               placeholder="Search by name, roll number or class..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
// //             />
// //           </div>
// //           <div className="w-full md:w-48 relative">
// //             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
// //             <select
// //               value={selectedStatus}
// //               onChange={(e) => setSelectedStatus(e.target.value)}
// //               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
// //             >
// //               <option value="">All Status</option>
// //               <option value="paid">Paid</option>
// //               <option value="unpaid">Unpaid</option>
// //               <option value="partial">Partial</option>
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       {/* No Results */}
// //       {filteredFees.length === 0 && (
// //         <div className="bg-gray-800 rounded-xl p-12 text-center">
// //           <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
// //           <p className="text-gray-400">No fee records found</p>
// //           <p className="text-gray-500 text-sm mt-2">
// //             {searchTerm || selectedStatus ? "Try changing your filters" : "Click 'Bulk Generate' to create fee records"}
// //           </p>
// //         </div>
// //       )}

// //       {/* Fees Table */}
// //       {filteredFees.length > 0 && (
// //         <>
// //           <div className="bg-gray-800 rounded-xl overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-700/50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Roll No</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Class</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Month</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-700">
// //                   {filteredFees.map((fee) => (
// //                     <tr key={fee._id} className="hover:bg-gray-700/50 transition-colors">
// //                       <td className="px-4 py-3">
// //                         <div>
// //                           <p className="text-white font-medium">{fee.studentId?.name || "N/A"}</p>
// //                           <p className="text-gray-500 text-xs">{fee.feeType}</p>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3 text-gray-400">{fee.rollNo || fee.studentId?.rollNo}</td>
// //                       <td className="px-4 py-3 text-gray-400">{fee.className}</td>
// //                       <td className="px-4 py-3 text-gray-400">{fee.month}</td>
// //                       <td className="px-4 py-3 text-white font-medium">₨ {fee.amount?.toLocaleString()}</td>
// //                       <td className="px-4 py-3">{getStatusBadge(fee.status)}</td>
// //                       <td className="px-4 py-3 text-gray-400 text-sm">
// //                         {fee.dueDate ? formatDate(fee.dueDate) : "N/A"}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex gap-2">
// //                           {fee.status !== "paid" && (
// //                             <button
// //                               onClick={() => handleMarkAsPaid(fee._id)}
// //                               disabled={markAsPaidMutation.isPending}
// //                               className="p-1.5 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors disabled:opacity-50"
// //                               title="Mark as Paid"
// //                             >
// //                               {markAsPaidMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
// //                             </button>
// //                           )}
// //                           <button
// //                             onClick={() => {
// //                               setSelectedFee(fee);
// //                               setShowEditModal(true);
// //                             }}
// //                             className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
// //                             title="Edit"
// //                           >
// //                             <Edit size={16} />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDeleteFee(fee._id, fee.studentId?.name)}
// //                             disabled={deleteFeeMutation.isPending}
// //                             className="p-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors disabled:opacity-50"
// //                             title="Delete"
// //                           >
// //                             {deleteFeeMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           {/* Pagination */}
// //           {pagination.totalPages > 1 && (
// //             <div className="flex justify-center items-center gap-2 mt-6">
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
// //                 disabled={currentPage === 1}
// //                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
// //               >
// //                 <ChevronLeft size={18} className="text-white" />
// //               </button>
// //               <span className="text-gray-400">
// //                 Page {currentPage} of {pagination.totalPages}
// //               </span>
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
// //                 disabled={currentPage === pagination.totalPages}
// //                 className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
// //               >
// //                 <ChevronRight size={18} className="text-white" />
// //               </button>
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {/* Add Single Fee Modal */}
// //       {showAddModal && (
// //         <Modal title="Add Single Fee" onClose={() => setShowAddModal(false)}>
// //           <form onSubmit={handleAddFee} className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number *</label>
// //               <input
// //                 type="text"
// //                 value={formData.rollNo}
// //                 onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
// //                 placeholder="e.g., 2024-001"
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
// //               <select
// //                 value={formData.month}
// //                 onChange={(e) => setFormData({...formData, month: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               >
// //                 <option value="">Select Month</option>
// //                 {months.map(month => (
// //                   <option key={month} value={`${month} ${new Date().getFullYear()}`}>
// //                     {month} {new Date().getFullYear()}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR) *</label>
// //               <input
// //                 type="number"
// //                 value={formData.amount}
// //                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
// //                 placeholder="e.g., 5000"
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
// //               <select
// //                 value={formData.status}
// //                 onChange={(e) => setFormData({...formData, status: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //               >
// //                 <option value="unpaid">Unpaid</option>
// //                 <option value="paid">Paid</option>
// //                 <option value="partial">Partial</option>
// //               </select>
// //             </div>
// //             {formError && <p className="text-red-400 text-sm">{formError}</p>}
// //             <div className="flex gap-3 pt-4">
// //               <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
// //               <button type="submit" disabled={addFeeMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
// //                 {addFeeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Fee"}
// //               </button>
// //             </div>
// //           </form>
// //         </Modal>
// //       )}

// //       {/* Bulk Generate Modal */}
// //       {showBulkModal && (
// //         <Modal title="Bulk Generate Fees" onClose={() => setShowBulkModal(false)}>
// //           <form onSubmit={handleBulkGenerate} className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
// //               <select
// //                 value={bulkData.month}
// //                 onChange={(e) => setBulkData({...bulkData, month: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               >
// //                 <option value="">Select Month</option>
// //                 {months.map(month => (
// //                   <option key={month} value={`${month} ${new Date().getFullYear()}`}>
// //                     {month} {new Date().getFullYear()}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR) *</label>
// //               <input
// //                 type="number"
// //                 value={bulkData.amount}
// //                 onChange={(e) => setBulkData({...bulkData, amount: e.target.value})}
// //                 placeholder="e.g., 5000"
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Class (Optional)</label>
// //               <input
// //                 type="text"
// //                 value={bulkData.className}
// //                 onChange={(e) => setBulkData({...bulkData, className: e.target.value})}
// //                 placeholder="Leave empty for all classes"
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //               />
// //               <p className="text-gray-500 text-xs mt-1">Leave empty to generate for all classes</p>
// //             </div>
// //             {formError && <p className="text-red-400 text-sm">{formError}</p>}
// //             <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
// //               <p className="text-blue-400 text-sm flex items-center gap-2">
// //                 <AlertCircle size={14} />
// //                 This will generate fee records for all active students
// //               </p>
// //             </div>
// //             <div className="flex gap-3 pt-4">
// //               <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
// //               <button type="submit" disabled={bulkGenerateMutation.isPending} className="flex-1 px-4 py-2 bg-purple-600 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
// //                 {bulkGenerateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Fees"}
// //               </button>
// //             </div>
// //           </form>
// //         </Modal>
// //       )}

// //       {/* Edit Fee Modal */}
// //       {showEditModal && selectedFee && (
// //         <Modal title="Edit Fee Record" onClose={() => setShowEditModal(false)}>
// //           <form onSubmit={handleUpdateFee} className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
// //               <input
// //                 type="text"
// //                 value={selectedFee.studentId?.name || "N/A"}
// //                 disabled
// //                 className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Month</label>
// //               <input
// //                 type="text"
// //                 value={selectedFee.month}
// //                 onChange={(e) => setSelectedFee({...selectedFee, month: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
// //               <input
// //                 type="number"
// //                 value={selectedFee.amount}
// //                 onChange={(e) => setSelectedFee({...selectedFee, amount: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
// //               <select
// //                 value={selectedFee.status}
// //                 onChange={(e) => setSelectedFee({...selectedFee, status: e.target.value})}
// //                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
// //               >
// //                 <option value="unpaid">Unpaid</option>
// //                 <option value="paid">Paid</option>
// //                 <option value="partial">Partial</option>
// //               </select>
// //             </div>
// //             {formError && <p className="text-red-400 text-sm">{formError}</p>}
// //             <div className="flex gap-3 pt-4">
// //               <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
// //               <button type="submit" disabled={updateFeeMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
// //                 {updateFeeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Fee"}
// //               </button>
// //             </div>
// //           </form>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // }

// // // Modal Component
// // function Modal({ title, children, onClose }) {
// //   return (
// //     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
// //       <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
// //         <div className="p-6 border-b border-gray-700">
// //           <h2 className="text-xl font-bold text-white">{title}</h2>
// //         </div>
// //         <div className="p-6">
// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

































// "use client";

// import { useState, useEffect } from "react";
// import {
//   DollarSign,
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   Users,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   AlertCircle,
//   School,
//   RefreshCw,
//   X,
//   Ban,
//   TrendingUp,
//   Award,
//   Zap,
//   Bell,
//   Download
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// export default function AdminFeesPage() {
//   const [fees, setFees] = useState([]);
//   const [filteredFees, setFilteredFees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedFee, setSelectedFee] = useState(null);
//   const [aiInsights, setAiInsights] = useState(null);
//   const [checkingOverdue, setCheckingOverdue] = useState(false);
//   const [formData, setFormData] = useState({
//     rollNo: "",
//     month: "",
//     amount: "",
//     status: "unpaid",
//     feeType: "monthly"
//   });
//   const [bulkData, setBulkData] = useState({
//     month: "",
//     amount: "",
//     className: "",
//     feeType: "monthly",
//     customDueDate: ""
//   });
//   const [formError, setFormError] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     totalPages: 1,
//     hasMore: false
//   });

//   const itemsPerPage = 10;

//   // Helper to get auth token
//   const getAuthToken = () => {
//     return localStorage.getItem('token');
//   };

//   // Helper to create headers with auth
//   const getAuthHeaders = () => {
//     const token = getAuthToken();
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` })
//     };
//   };

//   // Fetch fees with pagination
//   const fetchFees = async (page = 1) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/fees?page=${page}&limit=${itemsPerPage}`, {
//         headers: getAuthHeaders()
//       });
//       const data = await res.json();
//       if (data.success) {
//         setFees(data.data);
//         setFilteredFees(data.data);
//         setPagination(data.pagination);
//       }
//     } catch (error) {
//       console.error("Error fetching fees:", error);
//       toast.error("Failed to fetch fees");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch AI insights from dashboard stats (single API call)
//   const fetchAiInsights = async () => {
//     try {
//       const token = getAuthToken();
      
//       // Single API call to dashboard stats
//       const res = await fetch("/api/admin/fees/dashboard-stats", {
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         }
//       });
      
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }
      
//       const data = await res.json();
      
//       if (data.success) {
//         setAiInsights({
//           stats: data.stats,
//           aiInsights: data.aiInsights
//         });
//       } else {
//         console.error("Failed to fetch insights:", data.message);
//         setAiInsights(null);
//       }
//     } catch (error) {
//       console.error("Error fetching AI insights:", error);
//       setAiInsights(null);
//     }
//   };

//   // Check overdue fees
//   const handleCheckOverdue = async () => {
//     setCheckingOverdue(true);
//     const loadingToast = toast.loading("Checking overdue fees...");
    
//     try {
//       const res = await fetch("/api/admin/fees/check-overdue", { 
//         method: "POST",
//         headers: getAuthHeaders()
//       });
      
//       if (!res.ok) {
//         // If /api/fees/check-overdue fails, try admin endpoint
//         const adminRes = await fetch("/api/admin/fees/check-overdue", { 
//           method: "POST",
//           headers: getAuthHeaders()
//         });
        
//         if (!adminRes.ok) {
//           throw new Error(`HTTP ${adminRes.status}`);
//         }
        
//         const adminData = await adminRes.json();
//         if (adminData.success) {
//           toast.dismiss(loadingToast);
//           toast.success(adminData.message);
//           fetchFees(currentPage);
//           fetchAiInsights();
//           return;
//         }
//       }
      
//       const data = await res.json();
      
//       if (data.success) {
//         toast.dismiss(loadingToast);
//         toast.success(data.message);
//         fetchFees(currentPage);
//         fetchAiInsights();
//       } else {
//         toast.dismiss(loadingToast);
//         toast.error(data.message || "Failed to check overdue fees");
//       }
//     } catch (error) {
//       console.error("Check overdue error:", error);
//       toast.dismiss(loadingToast);
//       toast.error("Failed to check overdue fees. Please try again.");
//     } finally {
//       setCheckingOverdue(false);
//     }
//   };

//   useEffect(() => {
//     fetchFees(currentPage);
//     fetchAiInsights();
//   }, [currentPage]);

//   // Filter fees
//   useEffect(() => {
//     let filtered = fees;
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(fee => 
//         fee.studentId?.name?.toLowerCase().includes(term) ||
//         fee.rollNo?.toLowerCase().includes(term) ||
//         fee.className?.toLowerCase().includes(term)
//       );
//     }
    
//     if (selectedStatus) {
//       filtered = filtered.filter(fee => fee.status === selectedStatus);
//     }
    
//     setFilteredFees(filtered);
//   }, [searchTerm, selectedStatus, fees]);

//   // Add single fee
//   const handleAddFee = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     const loadingToast = toast.loading("Adding fee...");

//     try {
//       const res = await fetch("/api/admin/fees", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.dismiss(loadingToast);
//         setShowAddModal(false);
//         setFormData({ rollNo: "", month: "", amount: "", status: "unpaid", feeType: "monthly" });
//         fetchFees(currentPage);
//         fetchAiInsights();
//         toast.success(data.message || "Fee record added successfully!");
//       } else {
//         toast.dismiss(loadingToast);
//         setFormError(data.message || "Failed to add fee");
//         toast.error(data.message || "Failed to add fee");
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       setFormError("Network error. Please try again.");
//       toast.error("Network error");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Bulk generate fees
//   const handleBulkGenerate = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     const loadingToast = toast.loading("Generating fees...");

//     try {
//       const res = await fetch("/api/admin/fees/bulk", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(bulkData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.dismiss(loadingToast);
//         setShowBulkModal(false);
//         setBulkData({ month: "", amount: "", className: "", feeType: "monthly", customDueDate: "" });
//         fetchFees(1);
//         fetchAiInsights();
//         toast.success(data.message || "Fees generated successfully!");
//       } else {
//         toast.dismiss(loadingToast);
//         setFormError(data.message || "Failed to generate fees");
//         toast.error(data.message || "Failed to generate fees");
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       setFormError("Network error. Please try again.");
//       toast.error("Network error");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Update fee
//   const handleUpdateFee = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setFormError("");

//     const loadingToast = toast.loading("Updating fee...");

//     try {
//       const updateData = {
//         month: selectedFee.month,
//         amount: Number(selectedFee.amount),
//         status: selectedFee.status,
//         feeType: selectedFee.feeType || "monthly",
//         className: selectedFee.className || "",
//         discount: Number(selectedFee.discount) || 0,
//         amountPaid: Number(selectedFee.amountPaid) || 0
//       };

//       const res = await fetch(`/api/admin/fees/${selectedFee._id}`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(updateData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.dismiss(loadingToast);
//         setShowEditModal(false);
//         setSelectedFee(null);
//         fetchFees(currentPage);
//         fetchAiInsights();
//         toast.success(data.message || "Fee updated successfully!");
//       } else {
//         toast.dismiss(loadingToast);
//         setFormError(data.message || "Failed to update fee");
//         toast.error(data.message || "Failed to update fee");
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       setFormError("Network error. Please try again.");
//       toast.error("Network error");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Delete fee
//   const handleDeleteFee = (id, studentName) => {
//     toast((t) => (
//       <div className="flex items-center gap-3">
//         <div className="flex-1">
//           <p className="font-medium text-sm">Delete Fee Record?</p>
//           <p className="text-xs text-gray-500 mt-0.5">Delete fee for {studentName}? This cannot be undone.</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={async () => {
//               toast.dismiss(t.id);
//               const loadingToast = toast.loading("Deleting...");
//               try {
//                 const res = await fetch(`/api/admin/fees/${id}`, { 
//                   method: "DELETE",
//                   headers: getAuthHeaders()
//                 });
//                 const data = await res.json();
//                 if (res.ok) {
//                   toast.dismiss(loadingToast);
//                   fetchFees(currentPage);
//                   fetchAiInsights();
//                   toast.success(data.message || "Fee record deleted!");
//                 } else {
//                   toast.dismiss(loadingToast);
//                   toast.error(data.message || "Failed to delete fee");
//                 }
//               } catch (error) {
//                 toast.dismiss(loadingToast);
//                 toast.error("Network error");
//               }
//             }}
//             className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), {
//       duration: 5000,
//       position: "top-center",
//     });
//   };

//   // Mark as paid
//   const handleMarkAsPaid = async (fee) => {
//     const loadingToast = toast.loading("Processing payment...");
    
//     try {
//       const res = await fetch(`/api/admin/fees/${fee._id}`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           status: "paid",
//           amountPaid: fee.amount,
//           paymentDate: new Date().toISOString()
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.dismiss(loadingToast);
//         fetchFees(currentPage);
//         fetchAiInsights();
//         toast.success(data.message || "Fee marked as paid!");
//       } else {
//         toast.dismiss(loadingToast);
//         toast.error(data.message || "Failed to update status");
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Network error");
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "paid":
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium"><CheckCircle size={10} /> Paid</span>;
//       case "unpaid":
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium"><XCircle size={10} /> Unpaid</span>;
//       case "overdue":
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-medium"><AlertCircle size={10} /> Overdue</span>;
//       case "partially-paid":
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium"><Clock size={10} /> Partially Paid</span>;
//       case "pending":
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"><AlertCircle size={10} /> Pending</span>;
//       default:
//         return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-medium"><Ban size={10} /> {status}</span>;
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   const handleRefresh = () => {
//     fetchFees(currentPage);
//     fetchAiInsights();
//     toast.success("Data refreshed!");
//   };

//   const handleClearFilters = () => {
//     setSearchTerm("");
//     setSelectedStatus("");
//   };

//   // Get stats from aiInsights
//   const stats = aiInsights?.stats || {};
//   const atRiskStudents = aiInsights?.aiInsights?.atRiskStudents || [];
//   const recommendations = aiInsights?.aiInsights?.recommendations || [];
//   const prediction = aiInsights?.aiInsights?.prediction || {};
//   const classPerformance = aiInsights?.aiInsights?.classPerformance || [];
  
//   // Calculate pending amount (overdue + unpaid)
//   const pendingAmount = (stats.overdueAmount || 0) + (stats.unpaidAmount || 0);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <DollarSign className="text-emerald-600" size={28} />
//                 Fee Management
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">Manage student fees and payment records</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button onClick={handleRefresh} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
//                 <RefreshCw size={18} />
//               </button>
//               <button onClick={handleCheckOverdue} disabled={checkingOverdue} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
//                 {checkingOverdue ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle size={16} />}
//                 Check Overdue
//               </button>
//               <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
//                 <Plus size={16} /> Add Single
//               </button>
//               <button onClick={() => setShowBulkModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
//                 <Users size={16} /> Bulk Generate
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* AI Insights Section */}
//         {aiInsights && (stats.totalStudents > 0 || atRiskStudents.length > 0) && (
//           <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
//             <div className="flex items-center gap-2 mb-4">
//               <Zap className="w-5 h-5 text-purple-600" />
//               <h2 className="text-lg font-semibold text-gray-800">AI Insights & Analytics</h2>
//               <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Live</span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//               <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
//                 <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Collection Rate</span></div>
//                 <p className="text-2xl font-bold text-gray-800">{stats.collectionRate || 0}%</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
//                 <div className="flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-xs text-gray-500">Overdue Amount</span></div>
//                 <p className="text-2xl font-bold text-red-600">₨ {(stats.overdueAmount || 0).toLocaleString()}</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
//                 <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">At-Risk Students</span></div>
//                 <p className="text-2xl font-bold text-orange-600">{atRiskStudents.length}</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
//                 <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Next Month Prediction</span></div>
//                 <p className="text-2xl font-bold text-green-600">₨ {(prediction.nextMonthCollection || 0).toLocaleString()}</p>
//               </div>
//             </div>

//             {/* Top Performing Class */}
//             {classPerformance && classPerformance.length > 0 && (
//               <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                 <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2"><Award size={14} /> Top Performing Class</p>
//                 <p className="text-sm text-green-600">
//                   {classPerformance[0]?.name}: {classPerformance[0]?.collectionRate}% collection rate 
//                   ({classPerformance[0]?.paid}/{classPerformance[0]?.total} students)
//                 </p>
//               </div>
//             )}

//             {/* At-Risk Students */}
//             {atRiskStudents.length > 0 && (
//               <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
//                 <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2"><AlertCircle size={14} /> At-Risk Students ({atRiskStudents.length})</p>
//                 <div className="space-y-1">
//                   {atRiskStudents.slice(0, 3).map((student, idx) => (
//                     <p key={idx} className="text-xs text-red-600">• {student.name} - {student.className} - ₨ {(student.totalPending || 0).toLocaleString()} pending ({student.unpaidMonths?.length || 0} months)</p>
//                   ))}
//                   {atRiskStudents.length > 3 && <p className="text-xs text-gray-500">+{atRiskStudents.length - 3} more students</p>}
//                 </div>
//               </div>
//             )}

//             {/* AI Recommendations */}
//             {recommendations.length > 0 && (
//               <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2"><Bell size={14} /> AI Recommendations</p>
//                 <ul className="space-y-1">
//                   {recommendations.slice(0, 3).map((rec, idx) => (
//                     <li key={idx} className="text-xs text-blue-600">• {rec}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Stats Cards - Updated with correct pending amount */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase font-semibold">Total Records</p>
//                 <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
//               </div>
//               <CreditCard size={28} className="text-blue-500 opacity-40" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase font-semibold">Collected</p>
//                 <p className="text-2xl font-bold text-emerald-600">₨ {(stats.collectedAmount || 0).toLocaleString()}</p>
//               </div>
//               <CheckCircle size={28} className="text-emerald-500 opacity-40" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
//                 <p className="text-2xl font-bold text-red-500">₨ {pendingAmount.toLocaleString()}</p>
//               </div>
//               <Clock size={28} className="text-red-500 opacity-40" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase font-semibold">Collection Rate</p>
//                 <p className="text-2xl font-bold text-purple-600">{stats.collectionRate || 0}%</p>
//               </div>
//               <School size={28} className="text-purple-500 opacity-40" />
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input type="text" placeholder="Search by name, roll number or class..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-text" />
//             </div>
//             <div className="w-full md:w-48 relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer appearance-none">
//                 <option value="">All Status</option>
//                 <option value="paid">Paid</option>
//                 <option value="unpaid">Unpaid</option>
//                 <option value="overdue">Overdue</option>
//                 <option value="partially-paid">Partially Paid</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
//             {(searchTerm || selectedStatus) && (
//               <button onClick={handleClearFilters} className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
//                 <X size={14} /> Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Loading / Empty / Table */}
//         {loading ? (
//           <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center shadow-sm">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//             <span className="ml-3 text-gray-500">Loading fees...</span>
//           </div>
//         ) : filteredFees.length === 0 ? (
//           <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
//             <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 font-medium">No fee records found</p>
//             <p className="text-gray-400 text-sm mt-2">{searchTerm || selectedStatus ? "Try changing your filters" : "Click 'Bulk Generate' to create fee records"}</p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-100 bg-gray-50/50">
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
//                       <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {filteredFees.map((fee) => (
//                       <tr key={fee._id} className="hover:bg-gray-50/50 transition-colors">
//                         <td className="p-4">
//                           <div>
//                             <p className="font-medium text-gray-900 text-sm">{fee.studentId?.name || "N/A"}</p>
//                             <p className="text-xs text-gray-500 capitalize">{fee.feeType || "Monthly"}</p>
//                           </div>
//                         </td>
//                         <td className="p-4 text-sm text-gray-600">{fee.rollNo || "N/A"}</td>
//                         <td className="p-4 text-sm text-gray-600">{fee.className || "N/A"}</td>
//                         <td className="p-4 text-sm text-gray-600">{fee.month || "N/A"}</td>
//                         <td className="p-4 text-sm font-medium text-gray-900">₨ {(fee.amount || 0).toLocaleString()}</td>
//                         <td className="p-4">{getStatusBadge(fee.status)}</td>
//                         <td className="p-4 text-sm text-gray-600">{fee.dueDate ? formatDate(fee.dueDate) : "N/A"}</td>
//                         <td className="p-4">
//                           <div className="flex items-center justify-end gap-2">
//                             {fee.status !== "paid" && (
//                               <button onClick={() => handleMarkAsPaid(fee)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
//                                 <CheckCircle size={12} /> Pay
//                               </button>
//                             )}
//                             <button onClick={() => { setSelectedFee(fee); setShowEditModal(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
//                               <Edit size={16} />
//                             </button>
//                             <button onClick={() => handleDeleteFee(fee._id, fee.studentId?.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {pagination.totalPages > 1 && (
//               <div className="flex items-center justify-between mt-6 px-4">
//                 <p className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} records</p>
//                 <div className="flex items-center gap-2">
//                   <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
//                     <ChevronLeft size={16} className="text-gray-600" />
//                   </button>
//                   <span className="text-sm text-gray-700 font-medium px-3">Page {currentPage} of {pagination.totalPages}</span>
//                   <button onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))} disabled={currentPage === pagination.totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
//                     <ChevronRight size={16} className="text-gray-600" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Add Fee Modal - Same as before */}
//       {showAddModal && (
//         <Modal title="Add Single Fee" onClose={() => setShowAddModal(false)}>
//           <form onSubmit={handleAddFee} className="space-y-4">
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Roll Number *</label><input type="text" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} placeholder="e.g., 2024-001" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required /></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Month *</label><select value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer" required><option value="">Select Month</option>{months.map(month => (<option key={month} value={`${month} ${new Date().getFullYear()}`}>{month} {new Date().getFullYear()}</option>))}</select></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Type</label><select value={formData.feeType} onChange={(e) => setFormData({...formData, feeType: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"><option value="monthly">Monthly</option><option value="admission">Admission</option><option value="exam">Exam</option><option value="other">Other</option></select></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (PKR) *</label><input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="e.g., 5000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required /></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="partially-paid">Partially Paid</option><option value="pending">Pending</option></select></div>
//             {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{formError}</p></div>}
//             <div className="flex gap-3 pt-2">
//               <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Fee"}</button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Bulk Generate Modal - Same as before */}
//       {showBulkModal && (
//         <Modal title="Bulk Generate Fees" onClose={() => setShowBulkModal(false)}>
//           <form onSubmit={handleBulkGenerate} className="space-y-4">
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Month *</label><select value={bulkData.month} onChange={(e) => setBulkData({...bulkData, month: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer" required><option value="">Select Month</option>{months.map(month => (<option key={month} value={`${month} ${new Date().getFullYear()}`}>{month} {new Date().getFullYear()}</option>))}</select></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Type</label><select value={bulkData.feeType} onChange={(e) => setBulkData({...bulkData, feeType: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"><option value="monthly">Monthly</option><option value="admission">Admission</option><option value="exam">Exam</option><option value="other">Other</option></select></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (PKR) *</label><input type="number" value={bulkData.amount} onChange={(e) => setBulkData({...bulkData, amount: e.target.value})} placeholder="e.g., 5000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required /></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Class (Optional)</label><input type="text" value={bulkData.className} onChange={(e) => setBulkData({...bulkData, className: e.target.value})} placeholder="Leave empty for all classes" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" /><p className="text-xs text-gray-400 mt-1">Leave empty to generate for all classes</p></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Due Date (Optional)</label><input type="date" value={bulkData.customDueDate} onChange={(e) => setBulkData({...bulkData, customDueDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" /><p className="text-xs text-gray-400 mt-1">Leave empty for auto-calculated due date (10th of month)</p></div>
//             {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{formError}</p></div>}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><p className="text-blue-700 text-sm flex items-center gap-2"><AlertCircle size={14} />This will generate fee records for all students</p></div>
//             <div className="flex gap-3 pt-2">
//               <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Fees"}</button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Edit Fee Modal - Same as before */}
//       {showEditModal && selectedFee && (
//         <Modal title="Edit Fee Record" onClose={() => setShowEditModal(false)}>
//           <form onSubmit={handleUpdateFee} className="space-y-4">
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Student</label><input type="text" value={selectedFee.studentId?.name || "N/A"} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" /></div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Month</label><input type="text" value={selectedFee.month} onChange={(e) => setSelectedFee({...selectedFee, month: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required /></div>
//             <div className="grid grid-cols-2 gap-4">
//               <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (PKR)</label><input type="number" value={selectedFee.amount} onChange={(e) => setSelectedFee({...selectedFee, amount: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required /></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Amount Paid</label><input type="number" value={selectedFee.amountPaid || 0} onChange={(e) => setSelectedFee({...selectedFee, amountPaid: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" /></div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label><select value={selectedFee.status} onChange={(e) => setSelectedFee({...selectedFee, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="partially-paid">Partially Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option></select></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Type</label><select value={selectedFee.feeType || "monthly"} onChange={(e) => setSelectedFee({...selectedFee, feeType: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"><option value="monthly">Monthly</option><option value="admission">Admission</option><option value="exam">Exam</option><option value="other">Other</option></select></div>
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Discount</label><input type="number" value={selectedFee.discount || 0} onChange={(e) => setSelectedFee({...selectedFee, discount: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" /></div>
//             {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{formError}</p></div>}
//             <div className="flex gap-3 pt-2">
//               <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
//               <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Fee"}</button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Modal Component
// function Modal({ title, children, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
//             <X size={18} className="text-gray-400" />
//           </button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// }

























// ----------------------------------------------------------------------


"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  AlertCircle,
  School,
  RefreshCw,
  X,
  Ban,
  TrendingUp,
  Award,
  Zap,
  Bell,
  Download,
  QrCode
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [checkingOverdue, setCheckingOverdue] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [formData, setFormData] = useState({
    rollNo: "",
    month: "",
    amount: "",
    status: "unpaid",
    feeType: "monthly"
  });
  const [bulkData, setBulkData] = useState({
    month: "",
    amount: "",
    className: "",
    feeType: "monthly",
    customDueDate: "",
    sendEmail: true
  });
  const [formError, setFormError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  });

  const itemsPerPage = 10;

  // Helper to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Helper to create headers with auth
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Fetch fees with pagination
  const fetchFees = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/fees?page=${page}&limit=${itemsPerPage}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setFees(data.data);
        setFilteredFees(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
      toast.error("Failed to fetch fees");
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI insights from dashboard stats
  const fetchAiInsights = async () => {
    try {
      const token = getAuthToken();
      
      const res = await fetch("/api/admin/fees/dashboard-stats", {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setAiInsights({
          stats: data.stats,
          aiInsights: data.aiInsights
        });
      } else {
        console.error("Failed to fetch insights:", data.message);
        setAiInsights(null);
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAiInsights(null);
    }
  };

  // Generate QR code for a fee
  const handleGenerateQR = async (fee) => {
    setGeneratingQR(true);
    const loadingToast = toast.loading("Generating QR code...");
    
    try {
      const res = await fetch("/api/admin/fees/generate-qr", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          feeId: fee._id,
          studentId: fee.studentId?._id,
          month: fee.month,
          amount: fee.amount,
          dueDate: fee.dueDate,
          studentName: fee.studentId?.name,
          rollNo: fee.rollNo,
          className: fee.className,
          email: fee.studentId?.email
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.dismiss(loadingToast);
        setQrCodeImage(data.qrCodeImage);
        setQrLink(data.qrLink);
        setSelectedFee(fee);
        setShowQRModal(true);
        toast.success("QR code generated!");
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to generate QR");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to generate QR code");
    } finally {
      setGeneratingQR(false);
    }
  };

  // Copy QR link to clipboard
  const copyQRLink = () => {
    if (qrLink) {
      navigator.clipboard.writeText(qrLink);
      toast.success("QR link copied to clipboard!");
    }
  };

  // Download QR code
  const downloadQR = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = `qr_${selectedFee?.studentId?.name}_${selectedFee?.month}.png`;
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  // Check overdue fees
  const handleCheckOverdue = async () => {
    setCheckingOverdue(true);
    const loadingToast = toast.loading("Checking overdue fees...");
    
    try {
      const res = await fetch("/api/admin/fees/check-overdue", { 
        method: "POST",
        headers: getAuthHeaders()
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success(data.message);
        fetchFees(currentPage);
        fetchAiInsights();
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to check overdue fees");
      }
    } catch (error) {
      console.error("Check overdue error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to check overdue fees. Please try again.");
    } finally {
      setCheckingOverdue(false);
    }
  };

  useEffect(() => {
    fetchFees(currentPage);
    fetchAiInsights();
  }, [currentPage]);

  // Filter fees
  useEffect(() => {
    let filtered = fees;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.studentId?.name?.toLowerCase().includes(term) ||
        fee.rollNo?.toLowerCase().includes(term) ||
        fee.className?.toLowerCase().includes(term)
      );
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(fee => fee.status === selectedStatus);
    }
    
    setFilteredFees(filtered);
  }, [searchTerm, selectedStatus, fees]);

  // Add single fee
  const handleAddFee = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormError("");

    const loadingToast = toast.loading("Adding fee...");

    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        setShowAddModal(false);
        setFormData({ rollNo: "", month: "", amount: "", status: "unpaid", feeType: "monthly" });
        fetchFees(currentPage);
        fetchAiInsights();
        toast.success(data.message || "Fee record added successfully!");
      } else {
        toast.dismiss(loadingToast);
        setFormError(data.message || "Failed to add fee");
        toast.error(data.message || "Failed to add fee");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setFormError("Network error. Please try again.");
      toast.error("Network error");
    } finally {
      setProcessing(false);
    }
  };

  // Bulk generate fees
  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormError("");

    const loadingToast = toast.loading("Generating fees and QR codes...");

    try {
      const res = await fetch("/api/admin/fees/bulk", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bulkData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        setShowBulkModal(false);
        setBulkData({ month: "", amount: "", className: "", feeType: "monthly", customDueDate: "", sendEmail: true });
        fetchFees(1);
        fetchAiInsights();
        
        // Show summary
        const summary = data.summary;
        toast.success(
          `${data.message}\nQR Generated: ${summary.qrGenerated || 0}\nEmails Sent: ${summary.emailsSent || 0}`
        );
      } else {
        toast.dismiss(loadingToast);
        setFormError(data.message || "Failed to generate fees");
        toast.error(data.message || "Failed to generate fees");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setFormError("Network error. Please try again.");
      toast.error("Network error");
    } finally {
      setProcessing(false);
    }
  };

  // Update fee
  const handleUpdateFee = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormError("");

    const loadingToast = toast.loading("Updating fee...");

    try {
      const updateData = {
        month: selectedFee.month,
        amount: Number(selectedFee.amount),
        status: selectedFee.status,
        feeType: selectedFee.feeType || "monthly",
        className: selectedFee.className || "",
        discount: Number(selectedFee.discount) || 0,
        amountPaid: Number(selectedFee.amountPaid) || 0
      };

      const res = await fetch(`/api/admin/fees/${selectedFee._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        setShowEditModal(false);
        setSelectedFee(null);
        fetchFees(currentPage);
        fetchAiInsights();
        toast.success(data.message || "Fee updated successfully!");
      } else {
        toast.dismiss(loadingToast);
        setFormError(data.message || "Failed to update fee");
        toast.error(data.message || "Failed to update fee");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setFormError("Network error. Please try again.");
      toast.error("Network error");
    } finally {
      setProcessing(false);
    }
  };

  // Delete fee
  const handleDeleteFee = (id, studentName) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">Delete Fee Record?</p>
          <p className="text-xs text-gray-500 mt-0.5">Delete fee for {studentName}? This cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting...");
              try {
                const res = await fetch(`/api/admin/fees/${id}`, { 
                  method: "DELETE",
                  headers: getAuthHeaders()
                });
                const data = await res.json();
                if (res.ok) {
                  toast.dismiss(loadingToast);
                  fetchFees(currentPage);
                  fetchAiInsights();
                  toast.success(data.message || "Fee record deleted!");
                } else {
                  toast.dismiss(loadingToast);
                  toast.error(data.message || "Failed to delete fee");
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Network error");
              }
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  // Mark as paid
  const handleMarkAsPaid = async (fee) => {
    const loadingToast = toast.loading("Processing payment...");
    
    try {
      const res = await fetch(`/api/admin/fees/${fee._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "paid",
          amountPaid: fee.amount,
          paymentDate: new Date().toISOString()
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        fetchFees(currentPage);
        fetchAiInsights();
        toast.success(data.message || "Fee marked as paid!");
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error");
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "paid":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium"><CheckCircle size={10} /> Paid</span>;
      case "unpaid":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium"><XCircle size={10} /> Unpaid</span>;
      case "overdue":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-medium"><AlertCircle size={10} /> Overdue</span>;
      case "partially-paid":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium"><Clock size={10} /> Partially Paid</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"><AlertCircle size={10} /> Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-medium"><Ban size={10} /> {status}</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleRefresh = () => {
    fetchFees(currentPage);
    fetchAiInsights();
    toast.success("Data refreshed!");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  // Get stats from aiInsights
  const stats = aiInsights?.stats || {};
  const atRiskStudents = aiInsights?.aiInsights?.atRiskStudents || [];
  const recommendations = aiInsights?.aiInsights?.recommendations || [];
  const prediction = aiInsights?.aiInsights?.prediction || {};
  const classPerformance = aiInsights?.aiInsights?.classPerformance || [];
  
  // Calculate pending amount (overdue + unpaid)
  const pendingAmount = (stats.overdueAmount || 0) + (stats.unpaidAmount || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="text-emerald-600" size={28} />
                Fee Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage student fees and payment records</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={handleRefresh} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <RefreshCw size={18} />
              </button>
              <button onClick={handleCheckOverdue} disabled={checkingOverdue} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
                {checkingOverdue ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle size={16} />}
                Check Overdue
              </button>
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
                <Plus size={16} /> Add Single
              </button>
              <button onClick={() => setShowBulkModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
                <Users size={16} /> Bulk Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* AI Insights Section */}
        {aiInsights && (stats.totalStudents > 0 || atRiskStudents.length > 0) && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">AI Insights & Analytics</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Live</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Collection Rate</span></div>
                <p className="text-2xl font-bold text-gray-800">{stats.collectionRate || 0}%</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-xs text-gray-500">Overdue Amount</span></div>
                <p className="text-2xl font-bold text-red-600">₨ {(stats.overdueAmount || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">At-Risk Students</span></div>
                <p className="text-2xl font-bold text-orange-600">{atRiskStudents.length}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Next Month Prediction</span></div>
                <p className="text-2xl font-bold text-green-600">₨ {(prediction.nextMonthCollection || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Top Performing Class */}
            {classPerformance && classPerformance.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2"><Award size={14} /> Top Performing Class</p>
                <p className="text-sm text-green-600">
                  {classPerformance[0]?.name}: {classPerformance[0]?.collectionRate}% collection rate 
                  ({classPerformance[0]?.paid}/{classPerformance[0]?.total} students)
                </p>
              </div>
            )}

            {/* At-Risk Students */}
            {atRiskStudents.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2"><AlertCircle size={14} /> At-Risk Students ({atRiskStudents.length})</p>
                <div className="space-y-1">
                  {atRiskStudents.slice(0, 3).map((student, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {student.name} - {student.className} - ₨ {(student.totalPending || 0).toLocaleString()} pending</p>
                  ))}
                  {atRiskStudents.length > 3 && <p className="text-xs text-gray-500">+{atRiskStudents.length - 3} more students</p>}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2"><Bell size={14} /> AI Recommendations</p>
                <ul className="space-y-1">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="text-xs text-blue-600">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <CreditCard size={28} className="text-blue-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Collected</p>
                <p className="text-2xl font-bold text-emerald-600">₨ {(stats.collectedAmount || 0).toLocaleString()}</p>
              </div>
              <CheckCircle size={28} className="text-emerald-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
                <p className="text-2xl font-bold text-red-500">₨ {pendingAmount.toLocaleString()}</p>
              </div>
              <Clock size={28} className="text-red-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.collectionRate || 0}%</p>
              </div>
              <School size={28} className="text-purple-500 opacity-40" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search by name, roll number or class..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
                <option value="partially-paid">Partially Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            {(searchTerm || selectedStatus) && (
              <button onClick={handleClearFilters} className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-500">Loading fees...</span>
          </div>
        ) : filteredFees.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No fee records found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Class</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Month</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                      <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFees.map((fee) => (
                      <tr key={fee._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-900 text-sm">{fee.studentId?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{fee.feeType || "Monthly"}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{fee.rollNo || "N/A"}</td>
                        <td className="p-4 text-sm text-gray-600">{fee.className || "N/A"}</td>
                        <td className="p-4 text-sm text-gray-600">{fee.month || "N/A"}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">₨ {(fee.amount || 0).toLocaleString()}</td>
                        <td className="p-4">{getStatusBadge(fee.status)}</td>
                        <td className="p-4 text-sm text-gray-600">{formatDate(fee.dueDate)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {fee.status !== "paid" && (
                              <button onClick={() => handleMarkAsPaid(fee)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors" title="Mark as paid">
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button onClick={() => handleGenerateQR(fee)} disabled={generatingQR} className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors" title="Generate QR Code">
                              <QrCode size={16} />
                            </button>
                            <button onClick={() => { setSelectedFee(fee); setShowEditModal(true); }} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteFee(fee._id, fee.studentId?.name)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Delete">
                              <Trash2 size={16} />
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
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} records
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm px-3">Page {currentPage} of {pagination.totalPages}</span>
                  <button onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))} disabled={currentPage === pagination.totalPages} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedFee && qrCodeImage && (
        <Modal title="Fee Payment QR Code" onClose={() => setShowQRModal(false)}>
          <div className="text-center">
            <div className="mb-4">
              <p className="font-semibold text-gray-800">{selectedFee.studentId?.name}</p>
              <p className="text-sm text-gray-500">Roll No: {selectedFee.rollNo} | {selectedFee.month}</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">PKR {selectedFee.amount?.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl inline-block border-2 border-gray-200 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeImage} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>
            
            <p className="text-sm text-gray-500 mb-4 break-all">{qrLink}</p>
            
            <div className="flex gap-3">
              <button onClick={copyQRLink} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Copy Link
              </button>
              <button onClick={downloadQR} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Download
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Share this link with parent or show QR code at counter
            </p>
          </div>
        </Modal>
      )}

      {/* Add Fee Modal */}
      {showAddModal && (
        <Modal title="Add Single Fee" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddFee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Roll Number *</label>
              <input type="text" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Month *</label>
              <select value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} className="w-full p-2.5 border rounded-lg" required>
                <option value="">Select Month</option>
                {months.map(month => (<option key={month} value={`${month} ${new Date().getFullYear()}`}>{month} {new Date().getFullYear()}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (PKR) *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 border rounded-lg">
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partially-paid">Partially Paid</option>
              </select>
            </div>
            {formError && <div className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border rounded-lg">Cancel</button>
              <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                {processing ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Add Fee"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Generate Modal */}
      {showBulkModal && (
        <Modal title="Bulk Generate Fees" onClose={() => setShowBulkModal(false)}>
          <form onSubmit={handleBulkGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month *</label>
              <select value={bulkData.month} onChange={(e) => setBulkData({...bulkData, month: e.target.value})} className="w-full p-2.5 border rounded-lg" required>
                <option value="">Select Month</option>
                {months.map(month => (<option key={month} value={`${month} ${new Date().getFullYear()}`}>{month} {new Date().getFullYear()}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (PKR) *</label>
              <input type="number" value={bulkData.amount} onChange={(e) => setBulkData({...bulkData, amount: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class (Optional)</label>
              <input type="text" value={bulkData.className} onChange={(e) => setBulkData({...bulkData, className: e.target.value})} placeholder="Leave empty for all classes" className="w-full p-2.5 border rounded-lg" />
              <p className="text-xs text-gray-400 mt-1">Leave empty to generate for all classes</p>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bulkData.sendEmail} onChange={(e) => setBulkData({...bulkData, sendEmail: e.target.checked})} />
                <span className="text-sm">Send QR code email to parents</span>
              </label>
            </div>
            {formError && <div className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
            <div className="bg-blue-50 p-3 rounded-lg text-blue-700 text-sm">
              This will generate fee records for all students with QR codes
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 py-2.5 border rounded-lg">Cancel</button>
              <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg disabled:opacity-50">
                {processing ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Generate"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Fee Modal */}
      {showEditModal && selectedFee && (
        <Modal title="Edit Fee Record" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdateFee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <input type="text" value={selectedFee.studentId?.name || "N/A"} disabled className="w-full p-2.5 border rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input type="text" value={selectedFee.month} onChange={(e) => setSelectedFee({...selectedFee, month: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" value={selectedFee.amount} onChange={(e) => setSelectedFee({...selectedFee, amount: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount Paid</label>
                <input type="number" value={selectedFee.amountPaid || 0} onChange={(e) => setSelectedFee({...selectedFee, amountPaid: e.target.value})} className="w-full p-2.5 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={selectedFee.status} onChange={(e) => setSelectedFee({...selectedFee, status: e.target.value})} className="w-full p-2.5 border rounded-lg">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partially-paid">Partially Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fee Type</label>
                <select value={selectedFee.feeType || "monthly"} onChange={(e) => setSelectedFee({...selectedFee, feeType: e.target.value})} className="w-full p-2.5 border rounded-lg">
                  <option value="monthly">Monthly</option>
                  <option value="admission">Admission</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {formError && <div className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border rounded-lg">Cancel</button>
              <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                {processing ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Update"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}