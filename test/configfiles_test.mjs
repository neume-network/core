// @format
import { resolve } from "path";

import test from "ava";
import {
  config as configSchema,
  crawlPath as crawlPathSchema,
} from "@neume-network/schema";
import Ajv from "ajv";
import addFormats from "ajv-formats";

test("if distributed example config complies to schema", async (t) => {
  const config = (await import(resolve("./config.mjs"))).default;
  const ajv = new Ajv();
  addFormats(ajv);
  const check = ajv.compile(configSchema);
  const valid = check(config);
  if (!valid) {
    t.fail(check.errors);
  } else {
    t.pass();
  }
});

test("if distributed example crawl path complies to schema", async (t) => {
  const config = (await import(resolve("./crawl_path.mjs"))).default;
  const ajv = new Ajv();
  addFormats(ajv);
  const check = ajv.compile(crawlPathSchema);
  const valid = check(config);
  if (!valid) {
    t.fail(check.errors);
  } else {
    t.pass();
  }
});
