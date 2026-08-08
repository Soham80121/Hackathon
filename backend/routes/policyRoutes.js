const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  }
});

const {
  getPolicies,
  uploadPolicy,
  deletePolicy,
} = require("../controllers/policyController");

router.get("/", auth, getPolicies);
router.post("/upload", auth, restrictTo("admin", "hr"), upload.single("policyFile"), uploadPolicy);
router.delete("/:id", auth, restrictTo("admin", "hr"), deletePolicy);

module.exports = router;
