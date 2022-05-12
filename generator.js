const faker = require("casual");
const fs = require("fs");
const path = require("path");

const ws = fs.createWriteStream(
  path.join(process.cwd(), "data", "import_dict.csv")
);

generate().then(() => ws.end());

async function generate() {
  const categories = faker.array_of_words(300);

  let rows = [];
  for (let i = 0; i < 90000000; ++i) {
    const word = faker.word;
    const description = faker.words(faker.integer(1, 3));
    rows.push([word, description, faker.random_element(categories)]);

    if (rows.length >= 1000) {
      console.log(">");
      await writeChunk(rows);
      rows = [];
    }
  }

  if (rows.length) {
    await writeChunk(rows);
    rows = [];
  }
}

async function writeChunk(rows) {
  return new Promise((resolve) => {
    ws.write(convertRowsToCSVString(rows), () => {
      console.log("<");
      resolve();
    });
  });
}

function convertRowsToCSVString(rows) {
  return rows.map((r) => r.join(";")).join("\n");
}
