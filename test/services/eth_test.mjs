//@format
import { env } from "process";

import { toHex, blockNumber } from "eth-fun";
import test from "ava";

import { translate } from "../../src/services/eth.mjs";

// TODO: Sandbox call with fetch-mock
test("translating tx receipt rpc call", async (t) => {
  const method = "eth_getTransactionReceipt";
  const params = [
    "0xed14c3386aea0c5b39ffea466997ff13606eaedf03fe7f431326531f35809d1d",
  ];
  const options = {
    url: env.RPC_HTTP_HOST,
  };
  const call = await translate(options, method, params);
  t.truthy(call);
});

// TODO: Sandbox call with fetch-mock
test("translating block by number rpc call", async (t) => {
  const options = {
    url: env.RPC_HTTP_HOST,
  };
  const currentNumber = await blockNumber(options);
  const method = "eth_getBlockByNumber";
  const params = [currentNumber, false];
  const call = await translate(options, method, params);
  t.truthy(call);
});
