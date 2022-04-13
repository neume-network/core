//@format
import test from "ava";
import esmock from "esmock";

import { messages } from "../../../src/services/extractor/api.mjs";

test("test throw on invalid message", async (t) => {
  t.plan(1);
  const workerMock = await esmock(
    "../../../src/services/extractor/worker.mjs",
    null,
    {
      worker_threads: {
        parentPort: {
          postMessage: () => t.true(true),
        },
        workerData: {
          concurrency: 1,
        },
      },
    }
  );

  const message = {
    hello: "world",
  };
  workerMock.messageHandler({})(message);
});

test("call exit", async (t) => {
  t.plan(1);
  const workerMock = await esmock(
    "../../../src/services/extractor/worker.mjs",
    null,
    {
      process: {
        exit: () => t.true(true),
      },
    }
  );

  workerMock.messageHandler()({
    type: "exit",
    version: messages.version,
  });
});
