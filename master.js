const cp = require("child_process");

const pool = [
  {
      proc: cp.exec("node ./exec.js", (err, stdout, stderr) => {
        console.error("Exec error", err);
        //   setTimeout(() => console.log(process.memoryUsage()), 10000);
        console.log(stdout);
      }),
      queueSize: 0,
  },
  {
      proc: cp.exec("node ./exec.js", (err, stdout, stderr) => {
        console.error("Exec error", err);
        //   setTimeout(() => console.log(process.memoryUsage()), 10000);
        console.log(stdout);
      }),
      queueSize: 1
  },
];

// execProcess.stdout.on("data", (data) => {
//   const message = JSON.parse(data.toString());
//   if (message.type === "started") {
//     console.log("->", process.memoryUsage());
//   }
//   if (message.type === "finished") {
//     console.log("->", process.memoryUsage(), message.value);
//   }
// });
// execProcess.on("close", () => console.log("Close"));
// execProcess.on("error", (e) => console.error("Err", e));

// execProcess.stdin.write(JSON.stringify({ command: "start" }), console.error);
// execProcess.stderr.on("data", (e) => console.error(e.toString()));

// const spawnProcess = cp.spawn("node", ["spawn.js"]);
// spawnProcess.stdout.on("data", (data) => {
//   const message = JSON.parse(data.toString());
//   if (message.type === "started") {
//     console.log("->", process.memoryUsage());
//   }
//   if (message.type === "finished") {
//     console.log("->", process.memoryUsage(), message.value);
//   }
// });
// spawnProcess.on("close", () => console.log("Close"));
// spawnProcess.on("error", (e) => console.error("Err", e));

// spawnProcess.stdin.write(JSON.stringify({ command: "start" }), console.error);
// spawnProcess.stderr.on("data", (e) => console.error(e.toString()));

// const forkProcess = cp.fork("./fork.js", { stdio: "pipe" });
// forkProcess.stdout.on("data", (data) => {
//   const message = JSON.parse(data.toString());
//   if (message.type === "started") {
//     console.log("->", process.memoryUsage());
//   }
//   if (message.type === "finished") {
//     console.log("->", process.memoryUsage(), message.value);
//   }
// });
// forkProcess.on("close", () => console.log("Close"));
// forkProcess.on("error", (e) => console.error("Err", e));

// forkProcess.stdin.write(JSON.stringify({ command: "start" }), console.error);
// forkProcess.stderr.on("data", (e) => console.error(e.toString()));

// const arr = [];
// for (let i = 0; i <= 10000; i++) {
//   if (i === 1) {
//     console.log(">", process.memoryUsage());
//   }
//   for (let j = 0; j <= 1000; j++) {
//     arr.push("LOREM ipsum dolo");
//   }
// }
// console.log(">", process.memoryUsage());
