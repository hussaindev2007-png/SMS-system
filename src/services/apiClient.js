import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ✅ Request interceptor - Fix for SSR (check if window exists)
apiClient.interceptors.request.use(
  (config) => {
    // ✅ Only access localStorage on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      
      const userRole = localStorage.getItem("userRole");
      if (userRole) {
        config.headers["x-user-role"] = userRole;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - Fix for SSR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Only redirect on client side
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;