import { resolve } from "path";
import { env } from "process";

// crawlPath[i] and crawlPath[i+1] are executed in sequence
// crawlPath[i][j] and crawlPath[i][j+1] are executed in parallel
export default [
  [{ name: "web3subgraph", extractor: {}, transformer: {} }],
  [
    {
      name: "soundxyz-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "web3subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "zora-call-tokenuri",
      extractor: {
        args: [resolve(env.DATA_DIR, "web3subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "zora-call-tokenmetadatauri",
      extractor: {
        args: [resolve(env.DATA_DIR, "web3subgraph-transformation")],
      },
      transformer: {},
    },
    {
      name: "soundxyz-metadata",
      extractor: {
        args: [resolve(env.DATA_DIR, "web3subgraph-transformation")],
      },
      transformer: {},
    },
  ],
  [
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
