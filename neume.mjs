#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { boot } from "./src/boot.mjs";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <options>")
  .describe("path", "Sequence of strategies that the crawler will follow.")
  .nargs("path", 1)
  .demandOption("path")
  .describe("config", "Configuration for neume CLI")
  .nargs("config", 1).argv;

boot(argv.path, argv.config);
