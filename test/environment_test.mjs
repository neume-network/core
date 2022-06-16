// @format
import test from "ava";

import { validate, requiredVars } from "../src/environment.mjs";
import { NotFoundError } from "../src/errors.mjs";

test("environment validation function", (t) => {
  t.throws(() => validate(["non-existent-env-var"]), {
    instanceOf: NotFoundError,
  });

  t.truthy(requiredVars);
  t.true(requiredVars.length > 0);
  validate(requiredVars);
  t.pass();
});
