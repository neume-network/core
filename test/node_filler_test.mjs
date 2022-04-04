// @format
import test from "ava";

import { __dirname } from "../src/node_filler.mjs";

test("getting __filename and __dirname", t => {
  t.truthy(__dirname);
});
