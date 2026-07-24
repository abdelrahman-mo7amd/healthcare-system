const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

async function authGuard(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    const staff = await Staff.findById(decoded.id).select("-password");
    if (!staff) return res.status(401).json({ message: "Not authorized, staff not found" });

    req.staff = staff;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.staff || !roles.includes(req.staff.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { authGuard, requireRole };
