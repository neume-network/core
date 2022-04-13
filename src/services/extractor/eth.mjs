//@format
import { blockNumber, getBlockByNumber, getTransactionReceipt } from "eth-fun";

import { NotImplementedError } from "../../errors.mjs";

export async function translate(options, method, params) {
  if (method === "eth_getTransactionReceipt") {
    return await getTransactionReceipt(options, params[0]);
  } else if (method === "eth_getBlockByNumber") {
    // NOTE: `getBlockByNumber` expects the `blockNumber` input to be an
    // hexadecimal (`0x...`) value.
    return await getBlockByNumber(options, ...params);
  } else if (method == "eth_blockNumber") {
    return await blockNumber(options);
  } else {
    throw new NotImplementedError();
  }
}
