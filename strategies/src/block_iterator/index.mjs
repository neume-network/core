// @format
import { toHex } from "eth-fun";

const options = {
  url: "https://cloudflare-eth.com/",
};

let worker;
let count = 0;

function hexadd(number, value) {
  return toHex(parseInt(number, 16) + value);
}

function handle(message) {
  const { method, params, results } = message;
  count++;
  console.log(count);
  if (method === "eth_getBlockByNumber") {
    const [blockNumber] = params;
    const nextBlockNumber = hexadd(blockNumber, 1);
    worker.postMessage(blockNumberMsg(nextBlockNumber));

    const { transactions } = results;
    transactions.forEach((txId) => worker.postMessage(txReceiptMsg(txId)));
  }
}

function txReceiptMsg(txId) {
  return {
    options,
    type: "json-rpc",
    method: "eth_getTransactionReceipt",
    params: [txId],
    results: null,
  };
}

function blockNumberMsg(blockNumber) {
  const includeTxBodies = false;
  return {
    options,
    type: "json-rpc",
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTxBodies],
    results: null,
  };
}

// TODO: Add json schema for this options object
export function run(options) {
  worker = options.worker;
  const message0 = blockNumberMsg(options.startBlock);
  worker.postMessage(message0);
  worker.on("message", handle);
}
