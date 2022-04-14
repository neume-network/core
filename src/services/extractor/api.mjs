// @format
import { exit } from "process";

import Ajv from "ajv";
import fetch from "cross-fetch";

import logger from "../logger.mjs";
import { ValidationError, NotImplementedError } from "../../errors.mjs";
import { translate } from "./eth.mjs";

const log = logger("extractor");
const ajv = new Ajv();
const version = "0.0.1";

const httpsMsg = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["https"],
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        url: { type: "string" },
        method: { type: "string" },
        body: { type: "string" },
        headers: { type: "object" },
      },
      required: ["url", "method"],
    },
    results: {
      type: "object",
      nullable: true,
    },
    error: {
      type: "string",
      nullable: true,
    },
  },
  required: ["type", "version", "error", "results", "options"],
};

const jsonRPCMsg = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["json-rpc"],
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
    error: {
      type: "string",
      nullable: true,
    },
  },
  // TODO: Require `error`
  required: ["type", "method", "params", "results", "version", "options"],
};

const exitMsg = {
  type: "object",
  required: ["type", "version"],
  properties: {
    type: {
      type: "string",
      enum: ["exit"],
    },
    version: {
      type: "string",
    },
  },
};

const schema = {
  oneOf: [jsonRPCMsg, exitMsg, httpsMsg],
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

async function route(message, cb) {
  const { type } = message;

  if (type === "json-rpc") {
    const { method, params, options } = message;
    log(`Calling JSON-RPC endpoint with method: ${method}`);
    let results;

    try {
      results = await translate(options, method, params);
    } catch (error) {
      return cb({ ...message, error });
    }

    return cb(null, { ...message, results });
  } else if (type === "https") {
    const { url, method, body, headers } = message.options;
    let options = {
      method,
    };

    if (body) {
      options.body = body;
    }
    if (headers) {
      options.headers = headers;
    }

    let results;
    try {
      results = await fetch(url, options);
    } catch (error) {
      return cb({ ...message, error: error.toString() });
    }

    if (results.status >= 400) {
      return cb({
        ...message,
        error: new Error(
          `Request unsuccessful with status: ${results.status}`
        ).toString(),
      });
    }

    // TODO: Invalid assumption here: JSON parsing should only happen when
    // respective accept header is set.
    let data;
    try {
      data = await results.json();
    } catch (error) {
      return cb({ ...message, error: error.toString() });
    }

    return cb(null, { ...message, results: data });
  } else {
    return cb({ ...message, error: new NotImplementedError() });
  }
}

export const messages = {
  schema,
  route,
  validate,
  version,
};
