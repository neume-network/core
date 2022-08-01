# neume-network-core

[![dry run prettier](https://github.com/neume-network/core/actions/workflows/prettier.yml/badge.svg)](https://github.com/neume-network/core/actions/workflows/prettier.yml)
[![unit tests](https://github.com/neume-network/core/actions/workflows/node.js.yml/badge.svg)](https://github.com/neume-network/core/actions/workflows/node.js.yml)

## installation

We're still building neume network so things are drastically changing all the
time. It may be that the main branch isn't working. But we're tagging
individual git commits that end up producing good results. Check
[changelog.md](https://github.com/neume-network/core/blob/main/changelog.md)
for all available tags.

### prerequsites

neume-network-core is dependent on an Ethereum full node JSON-RPC interface.
Consider running your own node or choose an existing service from
[ethereumnodes.com](https://ethereumnodes.com/).

```bash
# Clone the repository
git clone git@github.com:neume-network/core.git

# Copy the example .env file
# ⚠️ Be sure to update the variables in `.env` with the appropriate values!
cp .env-copy .env

# Install the dependencies
npm i

# Install eth-fun as a peerDependency
npm i eth-fun --no-save
```

### how to run?

The easiet way to run is using

```
npm run dev
```

### CLI

neume has a CLI which can be used to run strategies. Strategies are like React components which can extract, transform and load data.

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

- `crawl_path.mjs`: A crawl path that runs all strategies supported by neume to crawl music NFTs.
- `config.mjs`: A sample configuration which should be modified according to your environment. Configuration should follow the schema given in [@neume-network/schema](https://github.com/neume-network/schema/blob/main/src/schema.mjs).

## component contract

@neume-network/core guarantees the existence of variables and folders to other
@neume-network packages like @neume-network/strategies. Below, we outline what
core is currently guaranteeing:

### existence and definition of environment variables

@neume-network/core must guarantee the existence and definition of the
following environment variables:

```
RPC_HTTP_HOST=https://
DATA_DIR=data
EXTRACTION_WORKER_CONCURRENCY=12
IPFS_HTTPS_GATEWAY=https://
```

- If `RPC_HTTP_HOST` requires Bearer-token authorization, users must define
  `RPC_API_KEY` to be used in an HTTP `Authorization: Bearer ${RPC_API_KEY}`
  header.
- If `IPFS_HTTPS_GATEWAY` requires Bearer-token authorization, users must
  define `IPFS_HTTPS_GATEWAY_KEY` to be used in an HTTP `Authorization: Bearer ${IPFS_HTTPS_GATEWAY_KEY}` header.

### managing `DATA_DIR` and the file system directory

A directory containing the outputs of all @neume-network/strategies is called
the `DATA_DIR`. Apart from guaranteeing the environment variable's existence,
@neume-network/core must guarantee the directory's existence on the user's file
system.

## contributing

See [contributing.md](./contributing.md)

## license

Licensed as [SPDX-License-Identifier: GPL-3.0-only](https://spdx.org/licenses/GPL-3.0-only.html)
