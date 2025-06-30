const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

// Check if db.json exists
const dbPath = path.join(__dirname, "db.json")
if (!fs.existsSync(dbPath)) {
  console.error("❌ db.json file not found!")
  console.log("Please create a db.json file in the root directory.")
  process.exit(1)
}

// Start JSON server
console.log("🚀 Starting JSON Server...")
const server = spawn("npx", ["json-server", "--watch", "db.json", "--port", "3001", "--host", "0.0.0.0"], {
  stdio: "inherit",
  shell: true,
})

server.on("error", (err) => {
  console.error("❌ Failed to start server:", err.message)
  console.log("\n💡 Try installing json-server globally:")
  console.log("npm install -g json-server")
})

server.on("close", (code) => {
  console.log(`\n📡 Server process exited with code ${code}`)
})

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  server.kill("SIGINT")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server...")
  server.kill("SIGTERM")
  process.exit(0)
})
