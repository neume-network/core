//@format
import "dotenv/config";
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { exit } from "process";

import PQueue from "p-queue";
import debug from "debug";

import { NotImplementedError } from "../errors.mjs";
import { translate } from "./eth.mjs";
import { readJSONFileSync } from "./disc.mjs";
import { __dirname } from "../node_filler.mjs";

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
const name = `${pkg.name}:${module.name}`;
const log = debug(name);
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

function route(message) {
  const { type } = message;

  if (type === "exit") {
    log(`Received exit signal; shutting down`);
    exit(0);
  } else if (type === "json-rpc") {
    const { method, params } = message;
    log(`Calling JSON-RPC endpoint with method: ${method}`);
    queue.add(async () => {
      const results = await translate(method, params);
      return { ...message, results };
    });
  } else {
    throw new NotImplementedError();
  }
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
  parentPort.on("message", route);
}
