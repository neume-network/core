import test from "ava";
import { createWorker } from "../src/boot.mjs";

test("should be able to create worker", (t) => {
  return new Promise((resolve, reject) => {
    createWorker().then((w) => {
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
