import "dotenv/config";
import { Worker, isMainThread, workerData } from "worker_threads";

import logger from "../logger.mjs";
import { run } from "./worker.mjs";

const log = logger("extractor");
const module = {
  defaults: {
    workerData: {
      concurrency: 1,
    },
  },
};

if (isMainThread) {
  log("Detected mainthread: Respawning extractor as worker_thread");
  // INFO: We're launching this file as a `Worker` when the mainthread is
  // detected as this can be useful when running it without an accompanying
  // other process.
  new Worker(__filename, { workerData: module.defaults.workerData });
} else {
  run();
}
