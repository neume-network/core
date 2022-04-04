// @format
import { readFileSync } from "fs";

export function readJSONFileSync(path) {
  const contents = readFileSync(path).toString();
  return JSON.parse(contents);
}
