//@format
import { env } from "process";

import test from "ava";
import esmock from "esmock";

import { messages } from "../../../src/services/extractor/api.mjs";
import { ValidationError } from "../../../src/errors.mjs";

test("validating version of message", (t) => {
  messages.validate({ type: "exit", version: messages.version });
  t.throws(() => messages.validate({ type: "exit", version: "1337.0.0" }));
});

test("validating schema `type` prop", (t) => {
  const message0 = {
    type: "exit",
    version: messages.version,
  };
  t.true(messages.validate(message0));

  const message1 = {
    type: "false type",
    version: messages.version,
  };
  t.throws(() => messages.validate(message1), { instanceOf: ValidationError });

  const message2 = {
    options: {
      url: env.RPC_HTTP_HOST,
    },
    version: messages.version,
    type: "json-rpc",
    method: "eth_getBlockByNumber",
    params: [],
    results: null,
  };
  t.true(messages.validate(message2));
});

test("routing a json-rpc job", async (t) => {
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

  t.plan(2);
  const cb = (err, res) => {
    t.falsy(err);
    t.truthy(res);
  };
  await messages.route(message, cb);
});

test("handling failed job", async (t) => {
  const apiMock = await esmock("../../../src/services/extractor/api.mjs", {
    "../../../src/services/extractor/eth.mjs": {
      translate: async () => {
        throw new Error("MockError");
      },
    },
  });

  const message = {
    options: {
      url: env.RPC_HTTP_HOST,
    },
    version: apiMock.messages.version,
    type: "json-rpc",
    method: "eth_getTransactionReceipt",
    params: [
      "0xed14c3386aea0c5b39ffea466997ff13606eaedf03fe7f431326531f35809d1d",
    ],
    results: null,
  };

  const cb = async (err, res) => {
    t.truthy(err);
    t.falsy(res);
  };
  await apiMock.messages.route(message, cb);
});
