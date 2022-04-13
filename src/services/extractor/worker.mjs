//@format
import { workerData, parentPort } from "worker_threads";
import { exit } from "process";

import Queue from "better-queue";

import logger from "../logger.mjs";
import { messages } from "./api.mjs";
import { translate } from "./eth.mjs";

const log = logger("extractor");

export function panic(taskId, message) {
  const error = message.error.toString();
  log(error);
  parentPort.postMessage({ ...message, error });
}

export function reply(taskId, message) {
  parentPort.postMessage(message);
}

export function messageHandler(queue) {
  return (message) => {
    try {
      messages.validate(message);
    } catch (error) {
      return panic(null, { ...message, error: error.toString() });
    }

    if (message.type === "exit") {
      log(`Received exit signal; shutting down`);
      exit(0);
    } else {
      queue.push(message);
    }
  };
}

export async function run() {
  log("Starting as worker thread");
  const { concurrency } = workerData;
  const queue = new Queue(messages.route, {
    concurrent: concurrency,
  });
  queue.on("task_finish", reply);
  queue.on("task_failed", panic);
  parentPort.on("message", messageHandler(queue));
}
