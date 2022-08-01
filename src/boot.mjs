//@format
import "dotenv/config";
import { Worker } from "worker_threads";
import { resolve } from "path";
import { env } from "process";
import { config as configSchema } from "@neume-network/schema";
import Ajv from "ajv";
import addFormats from "ajv-formats";

import { __dirname } from "./node_filler.mjs";
import logger from "./logger.mjs";
import * as strategies from "./strategies/src/index.mjs";
import * as environment from "./environment.mjs";
import * as disc from "./disc.mjs";

const workerPath = resolve(__dirname, "./worker_start.mjs");
const log = logger("boot");

export async function getConfig(configFile) {
  const config = (await import(resolve(configFile))).default;
  const ajv = new Ajv();
  addFormats(ajv);
  const check = ajv.compile(configSchema);
  const valid = check(config);
  if (!valid) {
    log(check.errors);
    throw new Error("Received invalid config");
  }
  return config;
}

export async function createWorker(config) {
  environment.validate(environment.requiredVars);
  await disc.provisionDir(resolve(env.DATA_DIR));

  const workerData = {
    queue: {
      options: {
        concurrent: parseInt(env.EXTRACTION_WORKER_CONCURRENCY, 10),
      },
    },
    ...config,
  };
  const worker = new Worker(workerPath, {
    workerData,
  });

  return worker;
}

export async function boot(crawlPathFile, configFile) {
  try {
    const crawlPath = (await import(resolve(crawlPathFile))).default;
    const config = await getConfig(configFile);
    const worker = await createWorker(config);
    await strategies.run(worker, crawlPath);
  } catch (err) {
    console.error(err);
  }
}
