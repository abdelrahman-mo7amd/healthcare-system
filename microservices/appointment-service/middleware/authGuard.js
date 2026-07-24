const jwt = require("jsonwebtoken");

// The appointment-service trusts the SAME JWT_SECRET issued by the
// primary backend's auth system, but verifies it locally -- it does
// NOT call back into the backend to check tokens. This keeps the
// service usable even if the primary backend is momentarily unhealthy.
function authGuard(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    req.staffId = decoded.id;
    req.staffRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
}

module.exports = { authGuard };
