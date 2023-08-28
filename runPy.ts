const { spawn } = require("child_process");

const pythonProcess = spawn("python", ["script.py"]);

pythonProcess.stdout.on("data", (data) => {
  console.log(`Python Output: ${data}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Python Error: ${data}`);
});

pythonProcess.on("close", (code) => {
  console.log(`Python script exited with code ${code}`);
});
