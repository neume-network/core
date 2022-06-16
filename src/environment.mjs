// @format
import { env } from "process";

import { NotFoundError } from "./errors.mjs";

export const requiredVars = [
  "RPC_HTTP_HOST",
  "RPC_API_KEY",
  "DATA_DIR",
  "EXTRACTION_WORKER_CONCURRENCY",
  "IPFS_HTTPS_GATEWAY",
];

export function validate(required) {
  for (const name of required) {
    if (!env[name]) {
      throw new NotFoundError(
        `Didn't find required name "${name}" in environment`
      );
    }
  }
}
