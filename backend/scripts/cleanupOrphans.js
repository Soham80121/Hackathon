const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load .env relative to this script
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Policy = require("../models/Policy");

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function runCleanup() {
  const isDeleteMode = process.argv.includes('--delete');
  
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log(`Uploads directory not found at: ${UPLOADS_DIR}`);
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.\n");

    const policies = await Policy.find({}).select("filePath");
    const dbFiles = new Set(
      policies
        .filter(p => p.filePath)
        .map(p => path.basename(p.filePath))
    );

    console.log(`Found ${dbFiles.size} valid PDF references in MongoDB.`);

    const physicalFiles = fs.readdirSync(UPLOADS_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`Found ${physicalFiles.length} actual PDF files in uploads/.\n`);

    const orphans = physicalFiles.filter(f => !dbFiles.has(f));
    const missing = Array.from(dbFiles).filter(f => !physicalFiles.includes(f));

    console.log(`--- ORPHAN FILES (${orphans.length}) ---`);
    console.log("These exist in uploads/ but are NOT in MongoDB:");
    if (orphans.length === 0) console.log("None!");
    orphans.forEach(f => console.log(`  - ${f}`));
    
    console.log(`\n--- MISSING FILES (${missing.length}) ---`);
    console.log("These are in MongoDB but missing from uploads/:");
    if (missing.length === 0) console.log("None!");
    missing.forEach(f => console.log(`  - ${f}`));
    
    console.log("\n=========================================");
    
    if (isDeleteMode) {
      if (orphans.length > 0) {
        console.log(`\nDeleting ${orphans.length} orphan files...`);
        let deleted = 0;
        for (const file of orphans) {
          try {
            fs.unlinkSync(path.join(UPLOADS_DIR, file));
            console.log(`Deleted: ${file}`);
            deleted++;
          } catch (e) {
            console.error(`Failed to delete ${file}:`, e.message);
          }
        }
        console.log(`Successfully deleted ${deleted} files.`);
      } else {
        console.log("No orphan files to delete.");
      }
    } else {
      console.log("\nDRY RUN COMPLETE.");
      if (orphans.length > 0) {
        console.log("To actually delete these orphan files, run this script again with the '--delete' flag:");
        console.log("node scripts/cleanupOrphans.js --delete");
      }
    }

  } catch (error) {
    console.error("Cleanup script error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

runCleanup();
