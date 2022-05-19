const { EOL } = require("os");
const fs = require("fs");
const { Transform, pipeline } = require("stream");

const toYML = new Transform({
  transform: function (chunk, encoding, next) {
    const ymlRow = chunk
      .toString()
      .split(EOL)
      .map((row) => {
        const [word, descr] = row.split(";");
        return `${word}: ${descr}`;
      })
      .join(EOL);
    next(null, ymlRow);
  },
});

process.on("message", (msg) => {
  const { command, categoryPath, dictionaryPath, importFrom } = JSON.parse(msg);
  if (command === "start") {
    console.log("got start command importing ", importFrom);
    process.send("started");
    importFile({ categoryPath, dictionaryPath, importFrom });
  }
});

const importFile = ({ categoryPath, dictionaryPath, importFrom }) => {
  const rs = fs.createReadStream(importFrom);
  const ws = fs.createWriteStream(dictionaryPath);

  rs.pipe(toYML).pipe(ws);

  const categories = {};
  rs.on("data", (data) => {
    data
      .toString("utf-8")
      .split(EOL)
      .map((r) => {
        const [word, , cat] = r.split(";");
        const category = categories[cat] || [];
        category.push(word);
        categories[cat] = category;
      });
  });

  rs.on("end", () => {
    fs.writeFile(categoryPath, JSON.stringify(categories, null, 4), (error) => {
      if (error) {
        console.error(`Error when writing to ${categoryPath}`);
      }
      process.send("finished");
    });
  });
};
