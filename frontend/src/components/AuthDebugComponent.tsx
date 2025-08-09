import React from "react";
import {
  getStoredAuthData,
  getUserDisplayName,
  getUserProfilePicture,
  isOAuthUser,
} from "../utils/auth";

const AuthDebugComponent: React.FC = () => {
  const { token, user } = getStoredAuthData();

  if (!token || !user) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h3 className="text-red-800 font-semibold">Not Authenticated</h3>
        <p className="text-red-600">No authentication data found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h3 className="text-green-800 font-semibold mb-2">
        Authentication Status
      </h3>
      <div className="space-y-2 text-green-700">
        <p>
          <strong>Display Name:</strong> {getUserDisplayName(user)}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Auth Provider:</strong> {user.authProvider}
        </p>
        <p>
          <strong>Is OAuth User:</strong> {isOAuthUser(user) ? "Yes" : "No"}
        </p>
        {getUserProfilePicture(user) && (
          <div>
            <p>
              <strong>Profile Picture:</strong>
            </p>
            <img
              src={getUserProfilePicture(user)!}
              alt="Profile"
              className="w-12 h-12 rounded-full mt-1"
            />
          </div>
        )}
        <p>
          <strong>Token (first 20 chars):</strong> {token.substring(0, 20)}...
        </p>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
