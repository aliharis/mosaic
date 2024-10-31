/**
 * This script creates the .env files for all the projects in the monorepo.
 */

const fs = require("fs");
const path = require("path");

// Define the base paths
const WEB_ENV_PATH = path.join(__dirname, "../apps/web/.env");
const API_ENV_PATH = path.join(__dirname, "../apps/api/.env");

// Sample environment variables
const webEnvContent = `# Web Environment Variables
VITE_GRAPHQL_API_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_API_URL=ws://localhost:4000/graphql`;

const apiEnvContent = `# API Environment Variables
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_db_name

# Authentication
JWT_SECRET=your-jwt-secret-change-me`;

function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function createEnvFile(filePath, content) {
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  ${filePath} already exists. Skipping...`);
    return;
  }

  try {
    // Ensure the directory exists
    ensureDirectoryExists(filePath);

    // Create the .env file
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filePath}`);
  } catch (error) {
    console.error(`❌ Error creating ${filePath}:`, error.message);
  }
}

// Create both .env files
console.log("🚀 Setting up environment files...");
createEnvFile(WEB_ENV_PATH, webEnvContent);
createEnvFile(API_ENV_PATH, apiEnvContent);
console.log("✨ Environment setup complete!");
