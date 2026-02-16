import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    return next(); // ✅ next must exist
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
