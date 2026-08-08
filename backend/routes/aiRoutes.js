const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { chat, getRecentQueries } = require("../controllers/aiController");

router.post("/chat", auth, chat);
router.get("/recent", auth, getRecentQueries);

module.exports = router;
