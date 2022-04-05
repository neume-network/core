// @format
import { Worker } from "worker_threads";
import { resolve } from "path";
import { once } from "events";

import { toHex } from "eth-fun";

import { __dirname } from "../src/node_filler.mjs";

const extractorPath = resolve(__dirname, "./services/extractor/worker.mjs");

run()
  .catch((err) => console.error(err))
  .then();

async function run() {
  const workerData = { concurrency: 10 };
  const w = new Worker(extractorPath, {
    workerData,
  });

  const blockNumber = toHex(14527022);
  const includeTxBodies = false;
  const message0 = {
    type: "json-rpc",
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTxBodies],
    results: null,
  };
  w.postMessage(message0);
  const [response] = await once(w, "message");

  let count = 0;
  w.on("message", (res) => {
    console.log("result", res);
    count++;

    if (count === response.results.transactions.length) {
      w.postMessage({ type: "exit" });
    }
  });
  response.results.transactions.forEach((txId) => {
    const message1 = {
      type: "json-rpc",
      method: "eth_getTransactionReceipt",
      params: [txId],
      results: null,
    };
    w.postMessage(message1);
  });
}
