const Staff = require("../models/Staff");

async function listStaff(req, res, next) {
  try {
    const { role, department } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    const staff = await Staff.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    next(err);
  }
}

async function getStaff(req, res, next) {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff member not found" });
    res.json(staff);
  } catch (err) {
    next(err);
  }
}

module.exports = { listStaff, getStaff };
