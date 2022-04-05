//@format
import test from "ava";
import PQueue from "p-queue";
import esmock from "esmock";

import { route } from "../../../src/services/extractor/handlers.mjs";

test("routing a json-rpc job", (t) => {
  t.plan(1);
  const queue = {
    add: () => t.true(true),
  };
  const message = {
    type: "json-rpc",
    method: "eth_getTransactionReceipt",
    params: [
      "0xed14c3386aea0c5b39ffea466997ff13606eaedf03fe7f431326531f35809d1d",
    ],
    results: null,
  };
  route(queue)(message);
});

test("routing a shutdown (exit)", async (t) => {
  t.plan(1);
  const { route } = await esmock(
    "../../../src/services/extractor/handlers.mjs",
    {
      process: {
        exit: () => t.true(true),
      },
    }
  );
  const message = {
    type: "exit",
  };
  route()(message);
});
