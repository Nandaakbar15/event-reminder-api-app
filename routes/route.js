const express = require("express");
const router = express();

// controller reminder
const {
  getAllReminders,
  getRemindersById,
  createReminder,
  deleteReminders,
  updateReminders,
} = require("../controller/reminderController");

// controller auth
const { register, login, logout } = require("../controller/authController");

// middleware
const { authMiddleware } = require("../middleware/middleware");

// main endpint
router.get("/", (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    message: "Event reminder Service App Backend",
  });
});

// endpoint auth
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);

// endpoint reminder (protected by JWT)
router.get("/api/reminder", authMiddleware, getAllReminders);
router.get("/api/reminder/:id", authMiddleware, getRemindersById);
router.post("/api/reminder", authMiddleware, createReminder);
router.put("/api/reminder/:id", authMiddleware, updateReminders);
router.delete("/api/reminder/:id", authMiddleware, deleteReminders);

module.exports = router;
