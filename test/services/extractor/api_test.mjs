//@format
import { env } from "process";

import test from "ava";
import esmock from "esmock";
import createWorker from "expressively-mocked-fetch";

import { messages } from "../../../src/services/extractor/api.mjs";
import { ValidationError } from "../../../src/errors.mjs";

test("sending invalid json as response", async (t) => {
  const worker = await createWorker(`
    app.get('/', function (req, res) {
      res.status(200).send("hello world");
    });
  `);
  const message = {
    type: "https",
    version: messages.version,
    options: {
      url: `http://localhost:${worker.port}`,
      method: "GET",
    },
    results: null,
    error: null,
  };

  t.plan(3);
  const cb = (err, response) => {
    t.true(err.error.includes("invalid json response"));
    t.falsy(response);
    t.truthy(err);
  };
  await messages.route(message, cb);
});

test("failing https request with status", async (t) => {
  const httpStatus = 401;
  const worker = await createWorker(`
    app.get('/', function (req, res) {
      res.status(${httpStatus}).send();
    });
  `);
  const message = {
    type: "https",
    version: messages.version,
    options: {
      url: `http://localhost:${worker.port}`,
      method: "GET",
    },
    results: null,
    error: null,
  };

  t.plan(3);
  const cb = (err, response) => {
    t.true(err.error.includes(httpStatus));
    t.falsy(response);
    t.truthy(err);
  };
  await messages.route(message, cb);
});

// TODO: Sandbox request with fetchMock
test("failing https request", async (t) => {
  const message = {
    type: "https",
    version: messages.version,
    options: {
      url: "https://thisdomaindoesntrespond.com",
      method: "GET",
    },
    results: null,
    error: null,
  };

  t.plan(3);
  const cb = (err, response) => {
    t.true(err.error.includes("FetchError"));
    t.falsy(response);
    t.truthy(err);
  };
  await messages.route(message, cb);
});

// TODO: Sandbox request with fetchMock
test("executing https job", async (t) => {
  const message = {
    type: "https",
    version: messages.version,
    options: {
      url: "https://api.thegraph.com/subgraphs/name/timdaub/web3musicsubgraph",
      method: "POST",
      body: JSON.stringify({
        query: `{ nfts(first: 1000) { id } }`,
      }),
    },
    results: null,
    error: null,
  };

  t.plan(4);
  const cb = (err, response) => {
    t.truthy(response);
    t.truthy(response.results.data);
    t.truthy(response.results.data.nfts);
    t.true(response.results.data.nfts.length > 0);
  };
  await messages.route(message, cb);
});

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

test("validating http job schema", (t) => {
  const message = {
    type: "https",
    version: "0.0.1",
    options: {
      url: "https://example.com",
      method: "GET",
    },
    results: null,
    error: null,
  };

  t.true(messages.validate(message));
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
