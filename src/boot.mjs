//@format
import "dotenv/config";
import { Worker } from "worker_threads";
import { resolve } from "path";

import { toHex } from "eth-fun";

import logger from "./logger.mjs";
import { __dirname } from "./node_filler.mjs";
import { run } from "./strategies/src/index.mjs";

const workerPath = resolve(__dirname, "./worker_start.mjs");

const workerData = { concurrency: 20 };
const worker = new Worker(workerPath, {
  workerData,
});

const inputs = {
  worker,
  startBlock: toHex(14532654),
};

const log = logger("strategies");
run(inputs, log);
