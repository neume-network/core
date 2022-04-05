//@format
import { env } from "process";
import { getBlockByNumber, getTransactionReceipt } from "eth-fun";

const options = {
  url: env.RPC_HTTP_HOST,
};

export async function translate(method, params) {
  if (method === "eth_getTransactionReceipt") {
    return await getTransactionReceipt(options, params[0]);
  }
  if (method === "eth_getBlockByNumber") {
    // NOTE: `getBlockByNumber` expects the `blockNumber` input to be an
    // hexadecimal (`0x...`) value.
    return await getBlockByNumber(options, ...params);
  }
}
