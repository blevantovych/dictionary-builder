const { EOL } = require("os");
const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");

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

const rs = fs.createReadStream(
  path.join(process.cwd(), "data", "import_dict.csv")
);

const ws = fs.createWriteStream(
  path.join(process.cwd(), "example", "dictionary.yml")
);

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
  const wordCategoryJsonPath = path.join(
    process.cwd(),
    "example",
    "word_category.json"
  );
  fs.writeFile(
    wordCategoryJsonPath,
    JSON.stringify(categories, null, 4),
    (error) => {
      if (error) {
        console.error(`Error when writing to ${wordCategoryJsonPath}`);
      }
    }
  );
});
