//@format
import test from "ava";
import PQueue from "p-queue";
import esmock from "esmock";

import { messages } from "../../../src/services/extractor/handlers.mjs";
import { ValidationError } from "../../../src/errors.mjs";

test("validating schema `type` prop", (t) => {
  const message0 = {
    type: "exit",
  };
  t.true(messages.validate(message0));

  const message1 = {
    type: "false type",
  };
  t.throws(() => messages.validate(message1), { instanceOf: ValidationError });

  const message2 = {
    type: "json-rpc",
    method: "eth_getBlockByNumber",
    params: [],
    results: null,
  };
  t.true(messages.validate(message2));
});

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
  messages.route(queue)(message);
});

test("routing a shutdown (exit)", async (t) => {
  t.plan(1);
  const { messages } = await esmock(
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
  messages.route()(message);
});
