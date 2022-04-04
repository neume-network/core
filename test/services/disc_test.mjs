// @format
import { resolve } from "path";

import test from "ava";

import { readJSONFileSync } from "../../src/services/disc.mjs";
import { __dirname } from "../../src/node_filler.mjs";

test("reading a json file", t => {
  const path = resolve(__dirname, "../package.json");
  const json = readJSONFileSync(path);
  t.truthy(json);
  t.truthy(json.name);
});
