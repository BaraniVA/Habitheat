import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface OAuthCallbackProps {
  onAuthSuccess: () => void;
  onAuthFailure: () => void;
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({
  onAuthSuccess,
  onAuthFailure,
}) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>(
    "Processing authentication..."
  );
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  useEffect(() => {
    const handleOAuthCallback = () => {
      // Prevent multiple processing
      if (hasProcessed) return;

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userParam = urlParams.get("user");
      const error = urlParams.get("error");

      // If no parameters are present yet, wait a bit longer
      if (!token && !userParam && !error) {
        return; // Exit early, let the next check handle it
      }

      setHasProcessed(true);

      if (error) {
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => {
          onAuthFailure();
        }, 2000);
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));

          // Store token and user data
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));

          setStatus("success");
          setMessage("Successfully signed in with Google!");

          // Clear URL parameters to prevent re-processing
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          setTimeout(() => {
            onAuthSuccess();
          }, 1500);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setStatus("error");
          setMessage("Error processing authentication data.");
          setTimeout(() => {
            onAuthFailure();
          }, 2000);
        }
      } else {
        setStatus("error");
        setMessage("Missing authentication data.");
        setTimeout(() => {
          onAuthFailure();
        }, 2000);
      }
    };

    // Add a small delay to ensure URL parameters are loaded
    const timeoutId = setTimeout(() => {
      handleOAuthCallback();
    }, 100);

    // Also check immediately and then periodically until we have data or timeout
    const intervalId = setInterval(() => {
      if (!hasProcessed) {
        handleOAuthCallback();
      } else {
        clearInterval(intervalId);
      }
    }, 200);

    // Cleanup timeout after 5 seconds if still no data
    const cleanupTimeoutId = setTimeout(() => {
      if (!hasProcessed) {
        setHasProcessed(true);
        setStatus("error");
        setMessage("Authentication timeout. Please try again.");
        setTimeout(() => {
          onAuthFailure();
        }, 2000);
      }
      clearInterval(intervalId);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      clearTimeout(cleanupTimeoutId);
    };
  }, []); // Remove dependencies to prevent multiple executions

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b35 50%, #d63031 75%, #74b9ff 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="mb-6">
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Authenticating...
                </h2>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Success!
                </h2>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
              </>
            )}

            <p className="text-gray-600">{message}</p>
          </div>

          {status === "loading" && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
