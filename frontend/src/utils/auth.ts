// OAuth utility functions

export interface OAuthUser {
  username: string;
  email: string;
  profilePicture?: string;
  authProvider: "local" | "google";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: OAuthUser;
}

/**
 * Initiates Google OAuth flow by redirecting to the backend OAuth endpoint
 */
export const initiateGoogleOAuth = (baseApiUrl: string): void => {
  const googleAuthUrl = `${baseApiUrl.replace(
    "/api/auth",
    ""
  )}/api/auth/google`;
  window.location.href = googleAuthUrl;
};

/**
 * Handles OAuth callback parameters from URL
 */
export const handleOAuthCallback = (): {
  token: string | null;
  user: OAuthUser | null;
  error: string | null;
} => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const userString = urlParams.get("user");
  const error = urlParams.get("error");

  if (error) {
    return { token: null, user: null, error };
  }

  if (token && userString) {
    try {
      const user = JSON.parse(decodeURIComponent(userString));
      return { token, user, error: null };
    } catch (parseError) {
      return { token: null, user: null, error: "Invalid user data" };
    }
  }

  return { token: null, user: null, error: null };
};

/**
 * Stores authentication data in localStorage
 */
export const storeAuthData = (token: string, user: OAuthUser): void => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Retrieves stored authentication data
 */
export const getStoredAuthData = (): {
  token: string | null;
  user: OAuthUser | null;
} => {
  const token = localStorage.getItem("authToken");
  const userString = localStorage.getItem("user");

  let user: OAuthUser | null = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }
  }

  return { token, user };
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const { token, user } = getStoredAuthData();
  return !!(token && user);
};

/**
 * Gets the user's profile picture URL with fallback
 */
export const getUserProfilePicture = (
  user: OAuthUser | null
): string | null => {
  return user?.profilePicture || null;
};

/**
 * Gets user's display name
 */
export const getUserDisplayName = (user: OAuthUser | null): string => {
  return user?.username || "User";
};

/**
 * Checks if user registered via OAuth
 */
export const isOAuthUser = (user: OAuthUser | null): boolean => {
  return user?.authProvider === "google";
};
