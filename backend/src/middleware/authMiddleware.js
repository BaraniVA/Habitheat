import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};