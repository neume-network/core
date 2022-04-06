// @format
import { resolve } from "path";

import test from "ava";

import { readJSONFileSync } from "../src/services/disc.mjs";
import { __dirname } from "../src/node_filler.mjs";

test("if all dependencies are pinned", (t) => {
  const path = resolve(__dirname, "../package.json");
  const pkg = readJSONFileSync(path);

  const values = [
    ...Object.values(pkg.dependencies),
    ...Object.values(pkg.devDependencies),
  ];

  const pattern = new RegExp("^[0-9]+.[0-9]+.[0-9]+$");
  t.false(pattern.test("^0.0.1"));
  t.plan(1 + values.length);
  values.forEach((val) => t.regex(val, pattern));
});
