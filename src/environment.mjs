// @format
import { env } from "process";

import { NotFoundError } from "./errors.mjs";

export function validate(required) {
  for (const name of required) {
    if (!env[name]) {
      throw new NotFoundError(
        `Didn't find required name "${name}" in environment`
      );
    }
  }
}
