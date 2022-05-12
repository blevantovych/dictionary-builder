const fs = require("fs");
const path = require("path");

const rs = fs.createReadStream(
  path.join(process.cwd(), "data", "import_dict.csv")
);

const categories = {};
let ymlData = [];
rs.on("data", (data) => {
  console.log(
    data
      .toString("utf-8")
      .split("\n")
      .map((r) => {
        const [word, descr, cat] = r.split(";");
        ymlData.push([word, descr]);
        const category = categories[cat] || [];
        category.push(word);
        categories[cat] = category;
      })
  );
  process.exit();
});
