#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { boot } from "./src/boot.mjs";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <options>")
  .describe("path", "Path for the crawler")
  .nargs("path", 1)
  .demandOption("path").argv;

boot(argv.path);
