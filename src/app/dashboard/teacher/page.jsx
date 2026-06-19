"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  MessageSquare,
  Bell,
  ChevronRight,
  Loader2,
  RefreshCw,
  Eye,
  Star,
  Briefcase,
  Mail,
  User
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    teacherName: "",
    teacherSubject: [],
    teacherEmail: ""
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    setCurrentTime(new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }));
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("userId");
      const teacherName = localStorage.getItem("userName");
      
      // Fetch stats
      const statsRes = await fetch(`/api/teacher/stats?id=${teacherId}`);
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats({
          total: statsData.stats.total || 0,
          pending: statsData.stats.pending || 0,
          completed: statsData.stats.completed || 0,
          teacherName: statsData.stats.teacherName || teacherName || "Teacher",
          teacherSubject: statsData.stats.teacherSubject || ["General"],
          teacherEmail: statsData.stats.teacherEmail || ""
        });
      }
      
      // Fetch recent assignments
      const assignmentsRes = await fetch(`/api/teacher/assignments?userId=${teacherId}&limit=5`);
      const assignmentsData = await assignmentsRes.json();
      if (assignmentsData.success) {
        setRecentAssignments(assignmentsData.data || []);
      }
      
      // Fetch recent submissions
      const submissionsRes = await fetch(`/api/teacher/submissions?teacherId=${teacherId}&limit=5`);
      const submissionsData = await submissionsRes.json();
      if (submissionsData.success) {
        setRecentSubmissions(submissionsData.data || []);
      }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }
    
    fetchDashboardData();
  }, [router]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return { icon: CheckCircle, text: "Active", color: "green" };
      case "expired":
        return { icon: Clock, text: "Expired", color: "red" };
      case "pending":
        return { icon: Clock, text: "Pending", color: "yellow" };
      case "reviewed":
        return { icon: CheckCircle, text: "Reviewed", color: "green" };
      default:
        return { icon: AlertCircle, text: status || "Unknown", color: "gray" };
    }
  };

  // Quick action cards
  const quickActions = [
    { title: "Create Assignment", icon: BookOpen, href: "/dashboard/teacher/assignments", color: "blue", bg: "bg-blue-50", textColor: "text-blue-600" },
    { title: "AI Generate", icon: Star, href: "/dashboard/teacher/assignments?ai=true", color: "purple", bg: "bg-purple-50", textColor: "text-purple-600" },
    { title: "Review Submissions", icon: FileText, href: "/dashboard/teacher/submissions", color: "green", bg: "bg-green-50", textColor: "text-green-600" },
    { title: "View Messages", icon: MessageSquare, href: "/dashboard/teacher/messages", color: "orange", bg: "bg-orange-50", textColor: "text-orange-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">{greeting} 👋</p>
                  <h1 className="text-2xl font-bold">{stats.teacherName || "Teacher"}</h1>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-blue-100">
                {stats.teacherSubject.length > 0 && (
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{stats.teacherSubject.join(", ")}</span>
                  </div>
                )}
                {stats.teacherEmail && (
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>{stats.teacherEmail}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">{currentTime}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className={`${action.bg} rounded-xl p-4 text-center hover:shadow-md transition-all group`}
              >
                <Icon className={`w-8 h-8 ${action.textColor} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className={`text-sm font-medium ${action.textColor}`}>{action.title}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-6 mt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                Recent Assignments
              </h2>
              <Link href="/dashboard/teacher/assignments" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentAssignments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No assignments yet</p>
                  <Link href="/dashboard/teacher/assignments" className="text-sm text-blue-600 mt-2 inline-block">
                    Create your first assignment
                  </Link>
                </div>
              ) : (
                recentAssignments.map((assignment) => {
                  const status = getStatusBadge(assignment.status);
                  const StatusIcon = status.icon;
                  const isUrgent = new Date(assignment.dueDate) - new Date() < 3 * 24 * 60 * 60 * 1000 && assignment.status === "active";
                  
                  return (
                    <div key={assignment._id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{assignment.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>Class {assignment.targetClass}</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUrgent && <span className="text-orange-500 text-xs">⚠️ Urgent</span>}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.color === "green" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <StatusIcon size={10} />
                            {status.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-green-500" />
                Recent Submissions
              </h2>
              <Link href="/dashboard/teacher/submissions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentSubmissions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No submissions yet</p>
                  <p className="text-sm">Students haven't submitted any assignments</p>
                </div>
              ) : (
                recentSubmissions.map((submission) => {
                  const isPending = submission.status === "pending";
                  
                  return (
                    <div key={submission._id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{submission.studentId?.name || "Student"}</p>
                          <p className="text-sm text-gray-500">{submission.assignmentId?.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(submission.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPending ? (
                            <Link
                              href={`/dashboard/teacher/submissions`}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs flex items-center gap-1"
                            >
                              <Clock size={12} />
                              Review
                            </Link>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs flex items-center gap-1">
                              <CheckCircle size={12} />
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-blue-500" />
              <h3 className="font-medium text-gray-800">Today's Schedule</h3>
            </div>
            <p className="text-gray-500 text-sm">No classes scheduled for today</p>
            <p className="text-xs text-gray-400 mt-2">Check your timetable for updates</p>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-orange-500" />
              <h3 className="font-medium text-gray-800">Upcoming Deadlines</h3>
            </div>
            {recentAssignments.filter(a => a.status === "active").slice(0, 2).length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming deadlines</p>
            ) : (
              recentAssignments.filter(a => a.status === "active").slice(0, 2).map(a => (
                <div key={a._id} className="mb-2">
                  <p className="text-sm text-gray-700">{a.title}</p>
                  <p className="text-xs text-gray-400">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-purple-500" />
              <h3 className="font-medium text-gray-800">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Students</span>
                <span className="font-medium text-gray-800">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Assignments Created</span>
                <span className="font-medium text-gray-800">{stats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pending Reviews</span>
                <span className="font-medium text-yellow-600">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}