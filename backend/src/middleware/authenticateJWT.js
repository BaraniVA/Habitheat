import jwt from "jsonwebtoken";

// Middleware to authenticate JWT from cookies or Authorization header
export default function authenticateJWT(req, res, next) {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = decoded;
  next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}
