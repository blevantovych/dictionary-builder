const arr = [];

process.stdin.on("data", (d) => {
  const message = JSON.parse(d.toString());
  if (message.command === "start") {
    for (let i = 0; i <= 10000; i++) {
      if (i === 1) {
        console.log(JSON.stringify({ type: "started" }));
      }
      for (let j = 0; j <= 1000; j++) {
        arr.push("LOREM ipsum dolo");
      }
    }
    console.log(JSON.stringify({ type: "finished", value: arr.length }));
  }
});
