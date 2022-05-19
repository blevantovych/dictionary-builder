const { fork } = require("child_process");
const path = require("path");

class ProcessPoolManager {
  constructor({ workers = 3, filesToImport = [] } = {}) {
    this.workers = workers;
    this.filesToImport = filesToImport;
    this.processes = Array.from({ length: workers }).map(() => ({
      process: fork("reader.js"),
      busy: false,
    }));
    this.importQueue = [];
    this.setUpProcesses();
  }

  setUpProcesses() {
    this.processes.forEach((cp) => {
      cp.process.on("message", (msg) => {
        if (msg === "finished") {
          cp.busy = false;
          if (this.importQueue.length) {
            this.import(this.importQueue.shift());
          }
        }
      });
    });
  }

  import(file) {
    const freeProcess = this.processes.find(({ busy }) => !busy);

    if (!freeProcess) {
      console.log("no free process");
      this.importQueue.push(file);
      return;
    }

    const categoryPath = path.join(
      process.cwd(),
      "example",
      `word_category_worker_${path.basename(file)}.json`
    );
    const dictionaryPath = path.join(
      process.cwd(),
      "example",
      `dictionary_worker_${path.basename(file)}.yml`
    );

    freeProcess.busy = true;
    freeProcess.process.send(
      JSON.stringify({
        command: "start",
        importFrom: file,
        categoryPath,
        dictionaryPath,
      })
    );
  }

  run() {
    this.filesToImport.forEach((file) => {
      this.import(file);
    });
  }
}

module.exports = { ProcessPoolManager };

const poolManager = new ProcessPoolManager({
  workers: 3,
  filesToImport: [
    path.join(process.cwd(), "data", "import_dict.csv"),
    path.join(process.cwd(), "data", "import_dict_1.csv"),
    path.join(process.cwd(), "data", "import_dict_2.csv"),
    path.join(process.cwd(), "data", "import_dict_3.csv"),
  ],
});

poolManager.run();

setTimeout(() => {
  poolManager.import(path.join(process.cwd(), "data", "import_dict_3.csv"));
}, 1000);

setTimeout(() => {
  poolManager.import(path.join(process.cwd(), "data", "import_dict_4.csv"));
}, 1500);

setTimeout(() => {
  poolManager.import(path.join(process.cwd(), "data", "import_dict_5.csv"));
}, 2000);

setTimeout(() => {
  poolManager.import(path.join(process.cwd(), "data", "import_dict_6.csv"));
}, 2000);
