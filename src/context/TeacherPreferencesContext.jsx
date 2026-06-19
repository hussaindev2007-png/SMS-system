"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/services/apiClient";

const TeacherPreferencesContext = createContext();

export function useTeacherPreferences() {
  return useContext(TeacherPreferencesContext);
}

export function TeacherPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    language: "english",
    theme: "dark",
    dashboardLayout: "comfortable",
    dateFormat: "DD/MM/YYYY",
    timeZone: "Asia/Karachi"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [preferences.theme]);

  const loadPreferences = async () => {
    const teacherId = localStorage.getItem("userId");
    if (!teacherId) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(`/teacher/preferences`, {
        params: { teacherId }
      });
      if (response.data.success) {
        setPreferences(response.data.preferences);
        // Save to localStorage for quick access
        localStorage.setItem("teacherPreferences", JSON.stringify(response.data.preferences));
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    const teacherId = localStorage.getItem("userId");
    try {
      const response = await apiClient.put("/teacher/preferences", {
        teacherId,
        preferences: newPreferences
      });
      if (response.data.success) {
        setPreferences(newPreferences);
        localStorage.setItem("teacherPreferences", JSON.stringify(newPreferences));
        return { success: true };
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      return { success: false };
    }
  };

  // Helper function to format date according to preference
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    if (preferences.dateFormat === "DD/MM/YYYY") {
      return `${day}/${month}/${year}`;
    }
    return `${month}/${day}/${year}`;
  };

  // Helper function to format time according to timezone
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      timeZone: preferences.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get text based on language
  const t = (key) => {
    const translations = {
      // Dashboard texts
      dashboard: { english: "Dashboard", urdu: "ڈیش بورڈ" },
      myAttendance: { english: "My Attendance", urdu: "میری حاضری" },
      myIDCard: { english: "My ID Card", urdu: "میرا آئی ڈی کارڈ" },
      assignments: { english: "Assignments", urdu: "اسائنمنٹس" },
      submissions: { english: "Submissions", urdu: "جمع کرائے گئے" },
      messages: { english: "Messages", urdu: "پیغامات" },
      
      // Common texts
      present: { english: "Present", urdu: "موجود" },
      absent: { english: "Absent", urdu: "غیر حاضر" },
      late: { english: "Late", urdu: "دیر سے" },
      totalDays: { english: "Total Days", urdu: "کل دن" },
      attendance: { english: "Attendance", urdu: "حاضری" },
      save: { english: "Save", urdu: "محفوظ کریں" },
      cancel: { english: "Cancel", urdu: "منسوخ کریں" },
      loading: { english: "Loading...", urdu: "لوڈ ہو رہا ہے..." }
    };

    const translation = translations[key];
    if (!translation) return key;
    return translation[preferences.language] || translation.english;
  };

  return (
    <TeacherPreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      formatDate,
      formatTime,
      t,
      loading
    }}>
      {children}
    </TeacherPreferencesContext.Provider>
  );
}