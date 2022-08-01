import { env } from "process";

export default {
  endpoints: {
    [env.RPC_HTTP_HOST]: {
      timeout: 10_000,
      requestsPerUnit: 25,
      unit: "second",
    },
    "https://metadata.sound.xyz": {
      timeout: 4000,
      requestsPerUnit: 6,
      unit: "second",
    },
    "https://ipfs.io": {
      timeout: 6000,
      requestsPerUnit: 50,
      unit: "second",
    },
  },
};
