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

export async function createWorker() {
  environment.validate(environment.requiredVars);
  await disc.provisionDir(resolve(__dirname, "..", env.DATA_DIR));

  const workerData = {
    queue: {
      options: {
        concurrent: parseInt(env.EXTRACTION_WORKER_CONCURRENCY, 10),
      },
    },
  };
  const worker = new Worker(workerPath, {
    workerData,
  });

  return worker;
}

async function boot(worker) {
  await strategies.run(worker);
}

if (env.NODE_ENV !== "test") {
  createWorker()
    .then(boot)
    .catch((err) => console.error("******", err));
}
