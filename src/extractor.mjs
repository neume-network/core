//@format
import { Worker, isMainThread, workerData } from "worker_threads";
import { resolve } from "path";
import { fileURLToPath } from "url";

import pLimit from "p-limit";
import debug from "debug";

import { readJSONFileSync } from "./services/disc.mjs";
import { __dirname } from "./node_filler.mjs";

const __filename = fileURLToPath(import.meta.url);
const pkg = readJSONFileSync(resolve(__dirname, "../package.json"));
const module = {
  name: "extractor",
  defaults: {
    workerData: {
      concurrency: 1,
    },
  },
};
const moduleName = "extractor";
const log = debug(`${pkg.name}:${module.name}`);

if (isMainThread) {
  log("Detected mainthread: Respawning extractor as worker_thread");
  new Worker(__filename, { workerData: module.defaults.workerData });
} else {
  run();
}

function run() {
  const { concurrency } = workerData;
  const limit = pLimit(concurrency);
  log(module, workerData);
}
