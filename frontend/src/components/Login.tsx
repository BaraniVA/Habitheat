import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Eye,
  EyeOff,
  Flame,
  Users,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Type definitions
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    username: string;
    email: string;
  };
}

interface ErrorResponse {
  message: string;
}

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

// Notification Component
const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`rounded-lg p-4 shadow-lg border-l-4 ${
          type === "error"
            ? "bg-red-50 border-red-500 text-red-700"
            : "bg-green-50 border-green-500 text-green-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {type === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  //const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api/auth';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/auth`
    : "/api/auth";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear notification when user starts typing
    if (notification) {
      setNotification(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setNotification({ type: "error", message: "All fields are required" });
      return false;
    }

    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({
        type: "error",
        message: "Please enter a valid email address",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store token and user data
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setNotification({ type: "success", message: response.data.message });

      // Reset form
      setFormData({ email: "", password: "" });

      // Call success callback
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook"): void => {
    if (provider === "google") {
      // Redirect to backend Google OAuth endpoint
      const backendUrl = API_BASE_URL.replace("/api/auth", "");
      window.location.href = `${backendUrl}/api/auth/google`;
    } else {
      console.log(`${provider} login not implemented yet`);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b35 50%, #d63031 75%, #74b9ff 100%)",
          //background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b35 50%, #d63031 75%, #74b9ff 100%)'
        }}
      >
        <div className="w-full max-w-md">
          {/* Header Illustration */}
          <div className="text-center mb-6 sm:mb-8">
            <div
              className="relative mx-auto w-full max-w-xs sm:max-w-sm h-32 sm:h-40 rounded-t-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b35 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-8 h-10 sm:w-12 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-40 rounded-full flex items-center justify-center">
                      <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                    <span className="text-orange-600 font-semibold text-xs sm:text-sm">
                      Habit Heat
                    </span>
                  </div>
                  <div className="w-8 h-10 sm:w-12 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-40 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-2 left-4 sm:top-4 sm:left-8 w-4 h-4 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full"></div>
              <div className="absolute top-4 right-6 sm:top-8 sm:right-12 w-3 h-3 sm:w-6 sm:h-6 bg-white bg-opacity-15 rounded-full"></div>
              <div className="absolute bottom-3 left-8 sm:bottom-6 sm:left-16 w-2 h-2 sm:w-4 sm:h-4 bg-white bg-opacity-25 rounded-full"></div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mr-2" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Welcome Back
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Sign in to continue tracking your habits
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                style={{
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b35 100%)",
                }}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="text-sm sm:text-base">
                  {isLoading ? "Signing In..." : "Sign In"}
                </span>
              </button>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Don't have an account?
                <button
                  onClick={onSwitchToSignup}
                  className="ml-2 text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </p>
            </div>

            {/* Social Login Options */}
            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="w-full inline-flex justify-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="ml-2 text-xs sm:text-sm">Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="w-full inline-flex justify-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2 text-xs sm:text-sm">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
