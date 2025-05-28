const express = require("express");
const { getStudents } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");
const User = require("../models/User");
const router = express.Router();
const Class = require("../models/Class");

router.get(
  "/students",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getStudents
);

// ✅ Create new user (admin can register teacher/student)
router.post("/", async (req, res) => {
  try {
    let { username, email, password, role, classId, classIds } = req.body;

    // Normalize email
    email = email.toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user object
    const user = new User({
      username,
      email,
      password,
      role,
      classId: role === "student" ? classId || null : undefined,
      classIds: role === "teacher" ? classIds || [] : undefined,
    });

    await user.save();

    // Add user to classes
    if (role === "student" && classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { studentIds: user._id },
      });
    } else if (role === "teacher" && Array.isArray(classIds)) {
      for (const id of classIds) {
        await Class.findByIdAndUpdate(id, {
          $addToSet: { teacherIds: user._id },
        });
      }
    }

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("[CREATE USER ERROR]:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ✅ Get all users by role
router.get("/role/:role", async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role }).select(
      "username email role classId classIds"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("[UPDATE USER ID]:", userId);
    console.log("[UPDATE USER BODY]:", req.body);

    let { username, email, password, classId, classIds } = req.body;

    if (email) email = email.toLowerCase();

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🧠 Determine role from existing user
    const role = existingUser.role;

    // 🔁 Handle class reassignment logic
    if (
      role === "student" &&
      classId &&
      existingUser.classId?.toString() !== classId
    ) {
      // Remove student from previous class
      if (existingUser.classId) {
        await Class.findByIdAndUpdate(existingUser.classId, {
          $pull: { studentIds: userId },
        });
      }

      // Add student to new class
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { studentIds: userId },
      });

      // ✅ Also update in the User model
      existingUser.classId = classId;
    }

    if (role === "teacher" && Array.isArray(classIds)) {
      // Remove teacher from all old classes
      await Class.updateMany(
        { teacherIds: userId },
        { $pull: { teacherIds: userId } }
      );

      // Add to selected new classes
      await Class.updateMany(
        { _id: { $in: classIds } },
        { $addToSet: { teacherIds: userId } }
      );

      // ✅ Also update in the User model
      existingUser.classIds = classIds;
    }

    // Update other fields
    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    if (password) {
      existingUser.password = password; // will be hashed in pre-save
    }

    await existingUser.save();

    res.status(200).json(existingUser);
  } catch (error) {
    console.error("[UPDATE USER ERROR]:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
