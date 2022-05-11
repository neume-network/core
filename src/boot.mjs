//@format
import "dotenv/config";
import { Worker } from "worker_threads";
import { resolve } from "path";

import { toHex } from "eth-fun";

import { __dirname } from "./node_filler.mjs";
import * as strategies from "./strategies/src/index.mjs";
import * as environment from "./environment.mjs";

const workerPath = resolve(__dirname, "./worker_start.mjs");

const workerData = { concurrency: 20 };
const worker = new Worker(workerPath, {
  workerData,
});

environment.validate(["RPC_HTTP_HOST", "RPC_API_KEY", "DATA_DIR"]);
strategies.run(worker);
