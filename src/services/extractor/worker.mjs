//@format
import "dotenv/config";
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { resolve } from "path";
import { exit } from "process";

import Queue from "better-queue";

import logger from "../logger.mjs";
import { messages } from "./api.mjs";
import { translate } from "./eth.mjs";

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

// TODO check how to properly return errors from worker
function panic(taskId, error) {
  log(error.toString());
  exit(1);
}

function reply(taskId, result) {
  parentPort.postMessage(result);
}

function messageHandler(queue) {
  return (message) => {
    try {
      messages.validate(message);
    } catch (err) {
      return panic(error);
    }

    if (message.type === "exit") {
      log(`Received exit signal; shutting down`);
      exit(0);
    }

    queue.push(message);
  };
}

async function run() {
  log("Starting as worker thread");
  const { concurrency } = workerData;
  const queue = new Queue(messages.route, {
    concurrent: concurrency,
  });
  queue.on("task_finish", reply);
  queue.on("task_failed", panic);
  parentPort.on("message", messageHandler(queue));
}
