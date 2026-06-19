"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  School, 
  GraduationCap, 
  Users, 
  BookOpen, 
  UserPlus,
  LogIn,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Shield,
  Sparkles,
  Building,
  Globe
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push(`/dashboard/${userRole}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Secure • Smart • Reliable</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                School Management
              </span>
              <br />
              <span className="text-gray-800">Made Simple</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
              Complete solution for managing students, teachers, fees, attendance, 
              and more. Streamline your school administration with ease.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                <ArrowRight size={18} />
              </button>
              
              {!isLoggedIn && (
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <UserPlus size={18} />
                  Register
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Users, label: "Students", value: "500+", color: "blue" },
                { icon: GraduationCap, label: "Teachers", value: "50+", color: "green" },
                { icon: BookOpen, label: "Subjects", value: "30+", color: "purple" },
                { icon: Award, label: "Graduates", value: "200+", color: "orange" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    <span className="text-sm font-bold text-gray-800">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to manage your school efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Student Management",
                description: "Track student records, attendance, and academic progress",
              },
              {
                icon: GraduationCap,
                title: "Teacher Management",
                description: "Manage teacher profiles, schedules, and performance",
              },
              {
                icon: BookOpen,
                title: "Fee Management",
                description: "Generate fees, track payments, and send reminders",
              },
              {
                icon: Calendar,
                title: "Attendance Tracking",
                description: "Real-time attendance with QR code verification",
              },
              {
                icon: School,
                title: "ID Card System",
                description: "Generate digital ID cards with QR codes for verification",
              },
              {
                icon: CheckCircle,
                title: "Smart Analytics",
                description: "AI-powered insights for better decision making",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Transform Your School?
          </h2>
          <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
            Join thousands of schools using our platform to manage their operations efficiently.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-blue-500/30 transition-all duration-300"
            >
              <LogIn size={18} />
              Login
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-blue-200 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-300" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-300" />
              Secure & private
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold">SMS Portal</span>
          </div>
          <p className="text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} School Management System. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}