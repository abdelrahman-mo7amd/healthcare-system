const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

function signToken(staff) {
  return jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET || "change_this_secret", {
    expiresIn: "8h",
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, role, department, ward } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    const exists = await Staff.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const staff = await Staff.create({ name, email, password, role, department, ward });
    res.status(201).json({ staff: staff.toSafeObject(), token: signToken(staff) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });
    if (!staff || !(await staff.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ staff: staff.toSafeObject(), token: signToken(staff) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ staff: req.staff });
}

module.exports = { register, login, me };
