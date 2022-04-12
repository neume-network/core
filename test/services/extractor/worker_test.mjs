//@format
import { env } from "process";
import { resolve } from "path";
import { Worker } from "worker_threads";
import { once } from "events";
import process from "process";

import test from "ava";

import { __dirname } from "../../../src/node_filler.mjs";
import { messages } from "../../../src/services/extractor/api.mjs";

const extractorPath = resolve(__dirname, "./services/extractor/worker.mjs");

test("shutting down extractor worker", async (t) => {
  const workerData = { concurrency: 1 };
  const w = new Worker(extractorPath, {
    workerData,
  });
  w.postMessage({ type: "exit", version: messages.version });
  t.deepEqual(await once(w, "exit"), [0]);
});

// TODO: Sandbox call with fetch-mock
test("running script in worker queue", async (t) => {
  const workerData = { concurrency: 1 };
  const w = new Worker(extractorPath, {
    workerData,
  });
  const message = {
    options: {
      url: env.RPC_HTTP_HOST,
    },
    version: messages.version,
    type: "json-rpc",
    method: "eth_getTransactionReceipt",
    params: [
      "0xed14c3386aea0c5b39ffea466997ff13606eaedf03fe7f431326531f35809d1d",
    ],
    results: null,
  };

  w.postMessage(message);
  const [response] = await once(w, "message");
  t.truthy(response);
  t.truthy(response.results);
  t.is(response.type, "json-rpc");
  t.deepEqual(response.params, message.params);
  t.is(response.method, "eth_getTransactionReceipt");
  w.postMessage({ type: "exit", version: messages.version });
  t.deepEqual(await once(w, "exit"), [0]);
});
