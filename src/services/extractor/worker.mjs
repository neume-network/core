//@format
import "dotenv/config";
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { resolve } from "path";
import { exit } from "process";

import PQueue from "p-queue";

import log from "./logger.mjs";
import { messages } from "./handlers.mjs";
import { translate } from "../eth.mjs";

const module = {
  defaults: {
    workerData: {
      concurrency: 1,
    },
  },
};
let queue;

if (isMainThread) {
  log("Detected mainthread: Respawning extractor as worker_thread");
  // INFO: We're launching this file as a `Worker` when the mainthread is
  // detected as this can be useful when running it without an accompanying
  // other process.
  new Worker(__filename, { workerData: module.defaults.workerData });
} else {
  run();
}

function panic(error) {
  log(error.toString());
  exit(1);
}

function reply(result) {
  parentPort.postMessage(result);
}

async function run() {
  log("Starting as worker thread");
  const { concurrency } = workerData;
  queue = new PQueue({ concurrency });
  queue.on("completed", reply);
  queue.on("error", panic);
  parentPort.on("message", messages.route(queue));
}
