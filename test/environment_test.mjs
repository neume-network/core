// @format
import test from "ava";

import { validate } from "../src/environment.mjs";
import { NotFoundError } from "../src/errors.mjs";

test("environment validation function", (t) => {
  t.throws(() => validate(["non-existent-env-var"]), {
    instanceOf: NotFoundError,
  });

  validate(["RPC_HTTP_HOST", "RPC_API_KEY", "DATA_DIR"]);
  t.pass();
});
