//@format
import "dotenv/config";
import { Worker } from "worker_threads";
import { resolve } from "path";
import { env } from "process";

import { __dirname } from "./node_filler.mjs";
import * as strategies from "./strategies/src/index.mjs";
import * as environment from "./environment.mjs";
import * as disc from "./disc.mjs";

const workerPath = resolve(__dirname, "./worker_start.mjs");

const workerData = { concurrency: 20 };
const worker = new Worker(workerPath, {
  workerData,
});

async function boot() {
  environment.validate(environment.requiredVars);
  await disc.provisionDir(resolve(__dirname, "..", env.DATA_DIR));
  await strategies.run(worker);
}

boot()
  .catch((err) => console.error(err))
  .then();
