import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import authService from "./authService";
import { useGlobalContext } from "./GlobalProvider";

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [error, setError] = useState("");
  const { setUser } = useGlobalContext();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      // Navigate based on user role
      if (response.token) {
        const userResponse = await axiosInstance.get("/auth/user");
        setUser(userResponse.data.decoded.user);
        navigate("/home");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-blue-900 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        
        

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
          Welcome to My App
        </h2>
        
        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Email:</label>
            <input
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
            // onClick={handleLogin}
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {/* Signup Link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          
        </p>
        <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
      </div>
    </div>
  );
};

export default Login;
