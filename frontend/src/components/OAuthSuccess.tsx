import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface OAuthSuccessProps {
  onLoginSuccess?: () => void;
}

const OAuthSuccess: React.FC<OAuthSuccessProps> = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userString = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Handle error cases
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_failed");
      return;
    }

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));

        // Store token and user data
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Call success callback or navigate to dashboard
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login?error=invalid_data");
      }
    } else {
      navigate("/login?error=missing_data");
    }
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-500">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
