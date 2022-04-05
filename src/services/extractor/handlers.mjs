// @format
import { exit } from "process";

import log from "./logger.mjs";
import { NotImplementedError } from "../../errors.mjs";
import { translate } from "../eth.mjs";

export function route(queue) {
  return (message) => {
    const { type } = message;

    if (type === "exit") {
      log(`Received exit signal; shutting down`);
      exit(0);
    } else if (type === "json-rpc") {
      const { method, params } = message;
      log(`Calling JSON-RPC endpoint with method: ${method}`);
      queue.add(async () => {
        const results = await translate(method, params);
        return { ...message, results };
      });
    } else {
      throw new NotImplementedError();
    }
  };
}
