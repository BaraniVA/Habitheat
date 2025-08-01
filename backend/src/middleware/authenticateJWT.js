import jwt from "jsonwebtoken";

// Middleware to authenticate JWT from cookies with detailed logging
export default function authenticateJWT(req, res, next) {
  // console.log("[authenticateJWT] Cookies received:", req.cookies);
  const token = req.cookies && req.cookies.token;
  if (!token) {
    // console.log("[authenticateJWT] No token found in cookies");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("[authenticateJWT] Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    // console.log("[authenticateJWT] JWT verification failed:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
}
