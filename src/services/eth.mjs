//@format
import { getBlockByNumber, getTransactionReceipt } from "eth-fun";

export async function translate(options, method, params) {
  if (method === "eth_getTransactionReceipt") {
    return await getTransactionReceipt(options, params[0]);
  }
  if (method === "eth_getBlockByNumber") {
    // NOTE: `getBlockByNumber` expects the `blockNumber` input to be an
    // hexadecimal (`0x...`) value.
    return await getBlockByNumber(options, ...params);
  }
}
