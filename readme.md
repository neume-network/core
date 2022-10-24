# @neume-network/core

[![dry run prettier](https://github.com/neume-network/core/actions/workflows/prettier.yml/badge.svg)](https://github.com/neume-network/core/actions/workflows/prettier.yml)
[![unit tests](https://github.com/neume-network/core/actions/workflows/node.js.yml/badge.svg)](https://github.com/neume-network/core/actions/workflows/node.js.yml)

## installation

We're still building neume network so things are drastically changing all the
time. It may be that the main branch isn't working. But we're tagging individual
git commits that end up producing good results. Check
[changelog.md](https://github.com/neume-network/core/blob/main/changelog.md) for
all available tags.

### prerequsites

neume-network-core is dependent on an Ethereum full node JSON-RPC interface.
Consider running your own node or choose an existing service from
[ethereumnodes.com](https://ethereumnodes.com/).

You'll receive the best results by running Erigon and colocating the neume
network crawler on the same machine as communication through a local socket is
vastly more performant compared to extraction over the network.

```bash
# Clone the repository
git clone git@github.com:neume-network/core.git

# Copy the example .env file
# ⚠️ Be sure to update the variables in `.env` with the appropriate values!
cp .env-copy .env

# Install the dependencies
npm i
```

### how to run?

The easiet way to run is using is via npm scripts.

However, there may be one issue to get started with, which is syncing an
Ethereum full node and downloading all event logs manually. To turbo start you,
we can offer to download a prefiltered flat file of event logs from all music
NFT platforms we currently crawl called the `call-block-logs-transformation`
file. We recommend everyone to host their own nodes of course, do it anon!

```
# The following line assumes your is DATA_DIR=data
curl https://raw.githubusercontent.com/neume-network/data/main/results/call-block-logs-transformation > \
  data/call-block-logs-transformation
```

```
npm run dev
```

It'll default to using the `./crawl_path.mjs` and `config.mjs` file.

## components

Each component of neume is published as a npm package. Below are the main
components of neume.

### `@neume-network/core`

The _core_ is the entrypoint for neume.

### `@neume-network/strategies`

Strategies are like React components which can extract, transform and load data.
For example, we can define a strategy that will _extract_ `tokenURI` from given
a list NFT addresses and then _transform_ the `tokenURI` to change `ipfs://` to
`https://ipfs.io/` or `ar://` to `https://arweave.net/`. For more information visit
[neume-network/strategies](https://github.com/neume-network/strategies/).

## component contract

@neume-network/core guarantees the existence of variables and folders to other
@neume-network packages like @neume-network/strategies. Below, we outline what
core is currently guaranteeing:

### existence and definition of environment variables

@neume-network/core must guarantee the existence and definition of the following
environment variables:

```
RPC_HTTP_HOST=https://
DATA_DIR=data
EXTRACTION_WORKER_CONCURRENCY=12
IPFS_HTTPS_GATEWAY=https://
ARWEAVE_HTTPS_GATEWAY=https://
```

- If `RPC_HTTP_HOST` requires Bearer-token authorization, users must define
  `RPC_API_KEY` to be used in an HTTP `Authorization: Bearer ${RPC_API_KEY}`
  header.
- If `IPFS_HTTPS_GATEWAY` requires Bearer-token authorization, users must define
  `IPFS_HTTPS_GATEWAY_KEY` to be used in an HTTP
  `Authorization: Bearer ${IPFS_HTTPS_GATEWAY_KEY}` header.

### managing `DATA_DIR` and the file system directory

A directory containing the outputs of all @neume-network/strategies is called
the `DATA_DIR`. Apart from guaranteeing the environment variable's existence,
@neume-network/core must guarantee the directory's existence on the user's file
system.

### JavaScript Usage

neume can be imported as a JavaScript utility to run strategies.

```js
import { boot } from "@neume-network/core";

const crawlPath = [[{ name: "get-xkcd", extractor: {} }]];
const config = {
  queue: {
    options: {
      concurrent: 1,
    },
  },
};
(async () => {
  await boot(crawlPath, config);
})();
```

### CLI

neume has a CLI which can be used to run strategies.

#### CLI options

```
Usage: neume.mjs <options>

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --path     Sequence of strategies that the crawler will follow.     [required]
  --config   Configuration for neume CLI
```

##### example

```sh
./neume.mjs --path crawl_path.mjs --config config.mjs
```

- `crawl_path.mjs`: A crawl path that runs all strategies supported by neume to
  crawl music NFTs.
- `config.mjs`: A configuration which should be modified according to your
  environment. Configuration should follow the schema given in
  [@neume-network/schema](https://github.com/neume-network/schema/blob/main/src/schema.mjs).

### Crawl Path

It is the path taken by the neume crawler. It is defined as a `.mjs` file and
should default export the desired path. The path must follow the schema given in
[@neume-network/schema](https://github.com/neume-network/schema/blob/main/src/schema.mjs).

#### Example:

> An understanding of neume strategies is required to understand the example

The below crawl path will first run `web3subgraph` strategy and then
`soundxyz-call-tokenuri` and `zora-call-tokenuri`. `soundxyz-call-tokenuri` and
`zora-call-tokenuri` will run after `web3subgraph` has completed and they both
will run in parallel.

`extractor.args` are inputs for
[extractor](https://github.com/neume-network/strategies/#extractor-strategy-interface-definition)
of the corresponding strategy. For example,
`0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/9956` will be an input to the
extractor of `web3subgraph`.

Similary, `transformer.args.slice(1)` are inputs for
[transformer](https://github.com/neume-network/strategies/#transformer-strategy-interface-definition)
of the corresponding strategy and `transformer.args[0]` is the file to be
transformed.

Both `extractor.args` and `transformer.args` are optional.

```js
export default [
  [
    {
      name: "web3subgraph",
      extractor: { args: ["0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/9956"] },
      transformer: {
        args: ["path/to/file", "some-argument"],
      },
    },
  ],
  [
    {
      name: "soundxyz-call-tokenuri",
      extractor: {
        args: ["path/to/file"],
      },
      transformer: {},
    },
    {
      name: "zora-call-tokenuri",
      extractor: {
        args: ["path/to/file"],
      },
      transformer: {},
    },
  ],
];
```

## contributing

See [contributing.md](./contributing.md)

## license

Licensed as
[SPDX-License-Identifier: GPL-3.0-only](https://spdx.org/licenses/GPL-3.0-only.html)
