import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import test from "ava";

import { createWorker, getConfig } from "../src/boot.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should be able to create worker", (t) => {
  return new Promise((resolve, reject) => {
    createWorker({ queue: { options: { concurrent: 10 } } }).then((w) => {
      setTimeout(() => {
        // no error has occured until now, safe to pass the test
        t.pass();
        resolve();
      }, 1000);

      w.on("error", (error) => {
        t.fail(error.toString());
        reject();
      });
    });
  });
});

test("should be able getConfig for a valid path", async (t) => {
  await t.notThrowsAsync(() => getConfig(resolve(__dirname, "../config.mjs")));
});

test("if getConfig fails on invalid config", async (t) => {
  await t.throwsAsync(() =>
    getConfig(resolve(__dirname, "../test/fixtures/falseconfig.mjs"))
  );
});

test("getConfig should throw error for invalid path", async (t) => {
  await t.throwsAsync(() => getConfig(resolve(__dirname)));
});
