require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Policy = require("../models/Policy");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

async function cleanupOrphans() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected.");

  console.log("Fetching policies...");
  const policies = await Policy.find({}, "filePath");
  
  // Extract just the filenames from the database records
  const validFilenames = policies.map(p => path.basename(p.filePath));
  console.log(`Found ${validFilenames.length} valid policy files in the database.`);

  console.log(`Scanning uploads directory: ${UPLOADS_DIR}`);
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log("Uploads directory does not exist. Nothing to clean.");
    process.exit(0);
  }

  const filesInUploads = fs.readdirSync(UPLOADS_DIR);
  console.log(`Found ${filesInUploads.length} files in uploads directory.`);

  let deletedCount = 0;
  for (const file of filesInUploads) {
    if (file === ".gitkeep") continue; // Ignore .gitkeep
    
    if (!validFilenames.includes(file)) {
      const filePath = path.join(UPLOADS_DIR, file);
      console.log(`DELETE → ${file} (orphaned)`);
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete ${file}:`, err.message);
      }
    } else {
      console.log(`KEEP → ${file} (referenced in MongoDB)`);
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} orphan files.`);
  
  // Cleanly disconnect
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
  process.exit(0);
}

cleanupOrphans().catch(err => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
