import axiosInstance from "./axiosInstance";

interface LoginCredentials {
  email: string;
  password: string;
}


const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.user);
      // localStorage.setItem("role", response.data.role);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
      localStorage.removeItem("user");
  },
 

  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
