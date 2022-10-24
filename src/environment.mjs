// @format
import { env } from "process";

import { NotFoundError } from "./errors.mjs";

export const requiredVars = [
  "RPC_HTTP_HOST",
  "DATA_DIR",
  "EXTRACTION_WORKER_CONCURRENCY",
  "IPFS_HTTPS_GATEWAY",
  "ARWEAVE_HTTPS_GATEWAY",
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
