//@format
import { resolve } from "path";
import { fileURLToPath } from "url";

import debug from "debug";

import { readJSONFileSync } from "../disc.mjs";
import { __dirname } from "../../node_filler.mjs";

const __filename = fileURLToPath(import.meta.url);
const pkg = readJSONFileSync(resolve(__dirname, "../package.json"));
const module = {
  name: "extractor",
};
const name = `${pkg.name}:${module.name}`;
const log = debug(name);

export default log;
