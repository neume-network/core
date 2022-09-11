#!/usr/bin/env node --unhandled-rejections=throw

import "dotenv/config";
import { resolve } from "path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { boot, getConfig } from "./src/boot.mjs";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <options>")
  .describe("path", "Sequence of strategies that the crawler will follow.")
  .nargs("path", 1)
  .demandOption("path")
  .describe("config", "Configuration for neume CLI")
  .nargs("config", 1).argv;

(async () => {
  const crawlPath = (await import(resolve(argv.path))).default;
  const config = await getConfig(argv.config);
  try {
    await boot(crawlPath, config);
  } catch (err) {
    console.error(err.toString());
  }
})();
