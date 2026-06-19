"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Moon,
  Sun,
  Layout,
  Calendar,
  Clock,
  Save,
  Loader2,
  CheckCircle,
  ChevronLeft
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function TeacherPreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    language: "english",
    theme: "dark",
    dashboardLayout: "comfortable",
    dateFormat: "DD/MM/YYYY",
    timeZone: "Asia/Karachi"
  });

  useEffect(() => {
    checkAuthAndFetchPreferences();
  }, []);

  const checkAuthAndFetchPreferences = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }

    await fetchPreferences(userId);
  };

  const fetchPreferences = async (teacherId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/teacher/preferences`, {
        params: { teacherId }
      });
      
      if (response.data.success) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const teacherId = localStorage.getItem("userId");
    
    setSaving(true);
    try {
      const response = await apiClient.put("/teacher/preferences", {
        teacherId,
        preferences
      });
      
      if (response.data.success) {
        toast.success("Preferences saved successfully!");
        
        // Apply theme immediately
        if (preferences.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        // Store in localStorage for global use
        localStorage.setItem("teacherPreferences", JSON.stringify(preferences));
      }
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const timeZones = [
    "Asia/Karachi",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "America/New_York",
    "Europe/London"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Layout size={28} />
                Preferences
              </h1>
              <p className="text-blue-100 mt-1">Customize your dashboard experience</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Appearance & Preferences</h2>
          
          <div className="space-y-6">
            {/* Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Language</p>
                  <p className="text-sm text-gray-400">Select your preferred language</p>
                </div>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="english">English</option>
                <option value="urdu">Urdu</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                {preferences.theme === "dark" ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <div>
                  <p className="text-white font-medium">Theme</p>
                  <p className="text-sm text-gray-400">Choose light or dark mode</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreferences({...preferences, theme: "dark"})}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    preferences.theme === "dark" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  <Moon size={14} /> Dark
                </button>
                <button
                  onClick={() => setPreferences({...preferences, theme: "light"})}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    preferences.theme === "light" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>

            {/* Dashboard Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Layout className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Dashboard Layout</p>
                  <p className="text-sm text-gray-400">Compact or comfortable view</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreferences({...preferences, dashboardLayout: "compact"})}
                  className={`px-4 py-2 rounded-lg transition ${
                    preferences.dashboardLayout === "compact" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setPreferences({...preferences, dashboardLayout: "comfortable"})}
                  className={`px-4 py-2 rounded-lg transition ${
                    preferences.dashboardLayout === "comfortable" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  Comfortable
                </button>
              </div>
            </div>

            {/* Date Format */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Calendar className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Date Format</p>
                  <p className="text-sm text-gray-400">Choose how dates are displayed</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreferences({...preferences, dateFormat: "DD/MM/YYYY"})}
                  className={`px-4 py-2 rounded-lg transition ${
                    preferences.dateFormat === "DD/MM/YYYY" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  DD/MM/YYYY
                </button>
                <button
                  onClick={() => setPreferences({...preferences, dateFormat: "MM/DD/YYYY"})}
                  className={`px-4 py-2 rounded-lg transition ${
                    preferences.dateFormat === "MM/DD/YYYY" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  MM/DD/YYYY
                </button>
              </div>
            </div>

            {/* Time Zone */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Time Zone</p>
                  <p className="text-sm text-gray-400">Select your time zone</p>
                </div>
              </div>
              <select
                value={preferences.timeZone}
                onChange={(e) => setPreferences({...preferences, timeZone: e.target.value})}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
              Save Preferences
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-white font-medium mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">
              <span className="text-white">Date Format Preview:</span>{" "}
              {preferences.dateFormat === "DD/MM/YYYY" ? "15/06/2026" : "06/15/2026"}
            </p>
            <p className="text-gray-400">
              <span className="text-white">Time Zone Preview:</span>{" "}
              {new Date().toLocaleTimeString('en-US', { timeZone: preferences.timeZone })}
            </p>
            <p className="text-gray-400">
              <span className="text-white">Layout Preview:</span>{" "}
              {preferences.dashboardLayout === "compact" ? "More items per row" : "More spacing between items"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}