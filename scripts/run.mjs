// @format
import "dotenv/config";
import { Worker } from "worker_threads";
import { resolve } from "path";

import { toHex } from "eth-fun";

import logger from "../src/services/extractor/logger.mjs";
import { __dirname } from "../src/node_filler.mjs";
import { run } from "../src/strategies/src/block_iterator/index.mjs";

const extractorPath = resolve(__dirname, "./services/extractor/worker.mjs");

const workerData = { concurrency: 20 };
const worker = new Worker(extractorPath, {
  workerData,
});

const inputs = {
  worker,
  startBlock: toHex(14532654),
};
// TODO: We need to allow getting worker from elsewhere and not through
// injection.
run(inputs, logger);
