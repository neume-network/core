// @format
import { exit } from "process";

import Ajv from "ajv";

import logger from "../logger.mjs";
import { ValidationError, NotImplementedError } from "../../errors.mjs";
import { translate } from "./eth.mjs";

const log = logger("extractor");
const ajv = new Ajv();
const version = "0.0.1";

const schema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["exit", "json-rpc"],
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
      required: ["url"],
    },
    method: {
      type: "string",
    },
    params: {
      type: "array",
    },
    results: {
      type: "object",
      nullable: true,
    },
  },
  allOf: [
    {
      if: {
        properties: { type: { const: "json-rpc" } },
      },
      then: { required: ["method", "params", "results", "version", "options"] },
    },
  ],
  required: ["type", "version"],
};

const check = ajv.compile(schema);
function validate(value) {
  const valid = check(value);
  if (!valid) {
    log(check.errors);
    throw new ValidationError(
      "Found 1 or more validation error when checking worker message"
    );
  }

  if (value.version !== version) {
    throw new ValidationError(
      `Difference in versions. Worker: "${version}", Message: "${value.version}"`
    );
  }

  return true;
}

function route(queue) {
  return (message) => {
    validate(message);

    const { type } = message;

    if (type === "exit") {
      log(`Received exit signal; shutting down`);
      exit(0);
    } else if (type === "json-rpc") {
      const { method, params, options } = message;
      log(`Calling JSON-RPC endpoint with method: ${method}`);
      queue.add(async () => {
        const results = await translate(options, method, params);
        return { ...message, results };
      });
    } else {
      throw new NotImplementedError();
    }
  };
}

export const messages = {
  schema,
  route,
  validate,
  version,
};
