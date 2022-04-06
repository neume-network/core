// @format
import { Worker } from "worker_threads";
import { resolve } from "path";

import { toHex } from "eth-fun";

import { __dirname } from "../src/node_filler.mjs";
import { run } from "../src/strategies/src/block_iterator/index.mjs";

const extractorPath = resolve(__dirname, "./services/extractor/worker.mjs");

const workerData = { concurrency: 10 };
const worker = new Worker(extractorPath, {
  workerData,
});
const options = {
  worker,
  startBlock: toHex(14531600),
};

run(options);
