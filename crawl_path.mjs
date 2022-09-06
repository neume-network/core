import { resolve } from "path";
import { env } from "process";

// crawlPath[i] and crawlPath[i+1] are executed in sequence
// crawlPath[i][j] and crawlPath[i][j+1] are executed in parallel
export default [
  [
    {
      name: "catalog-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "mintsongs-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "soundxyz-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "zora-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "zora-call-tokenmetadatauri",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "soundxyz-metadata",
      extractor: {
        args: [resolve(env.DATA_DIR, "logs-to-subgraph-transformation")],
      },
      transformer: {},
    },
  ],
  [
    {
      name: "catalog-get-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "catalog-call-tokenuri-transformation")],
      },
      transformer: {},
    },
    {
      name: "mintsongs-get-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "mintsongs-call-tokenuri-transformation")],
      },
      transformer: {},
    },
    {
      name: "soundxyz-get-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "soundxyz-call-tokenuri-transformation")],
      },
      transformer: {},
    },
    {
      name: "zora-get-tokenuri",
      extractor: {
        args: [
          resolve(env.DATA_DIR, "zora-call-tokenmetadatauri-transformation"),
        ],
      },
      transformer: {},
    },
  ],
  [
    {
      name: "music-os-accumulator",
      extractor: { args: [] },
      transformer: {},
    },
  ],
];
