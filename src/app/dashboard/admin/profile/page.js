"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Mail, Lock, Shield, Camera, Loader2,
  RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff,
  Smartphone, MapPin, Clock, Calendar, LogIn,
  Users, GraduationCap, DollarSign, Key, Save, X
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch profile
  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token
  });

  // Fetch login history
  const { data: historyData } = useQuery({
    queryKey: ["admin-login-history"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/profile/login-history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put("/api/admin/profile", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated!");
      queryClient.invalidateQueries(["admin-profile"]);
      setShowEditModal(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    }
  });

  // Change password mutation
  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put("/api/admin/profile/change-password", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed!");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
    },
    onError: (err) => {
      setPasswordError(err.response?.data?.message || "Failed to change password");
      toast.error(err.response?.data?.message || "Failed");
    }
  });

  const profile = profileData?.profile || {};
  const stats = profileData?.stats || {};
  const history = historyData?.history || [];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(editForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    passwordMutation.mutate(passwordForm);
  };

  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries(["admin-login-history"]);
    toast.success("Data refreshed!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="text-blue-600" size={28} />
              Admin Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
          </div>
          <button onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name?.charAt(0)?.toUpperCase() || "A"
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name || "Admin"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {profile.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={16} className="text-gray-400" />
                  Administrator
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Key size={16} className={profile.twoFactorEnabled ? "text-emerald-500" : "text-gray-400"} />
                  2FA: {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setEditForm({ name: profile.name, email: profile.email }); setShowEditModal(true); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer">
                  Edit Profile
                </button>
                <button onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Teachers</p><p className="text-2xl font-bold text-gray-900">{stats.totalTeachers || 0}</p></div>
              <GraduationCap size={28} className="text-blue-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Students</p><p className="text-2xl font-bold text-gray-900">{stats.totalStudents || 0}</p></div>
              <Users size={28} className="text-emerald-500 opacity-40" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500 uppercase font-semibold">Fees Collected</p><p className="text-2xl font-bold text-gray-900">₨ {stats.totalFeesCollected?.toLocaleString() || 0}</p></div>
              <DollarSign size={28} className="text-purple-500 opacity-40" />
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LogIn size={20} className="text-blue-600" />
              Login History
            </h3>
          </div>
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No login history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">IP Address</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Device</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          {entry.date ? new Date(entry.date).toLocaleString() : "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-gray-400" />
                          {entry.ip || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Smartphone size={12} className="text-gray-400" />
                          <span className="truncate max-w-[200px]">{entry.device || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                          entry.status === "success" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {entry.status === "success" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                          {entry.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                  {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input type={showOldPassword ? "text" : "password"} value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text pr-10" required />
                  <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showOldPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? "text" : "password"} value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text pr-10" required />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showNewPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text pr-10" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showConfirmPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{passwordError}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={passwordMutation.isPending}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                  {passwordMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}