import process from "node:process";
import { spawn } from "node:child_process";

const child = spawn("pnpm", ["run", "build"]);

child.stdout.on("data", (data) => {
  process.stdout.write(data);

  if (!~data.indexOf("You can deploy this build using ")) {
    return;
  }

  console.log("Build Success");

  setTimeout(() => {
    process.exit(0);
  }, 3000);
});
