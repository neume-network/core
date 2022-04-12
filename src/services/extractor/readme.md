# Extractor Worker API

The purpose of the music-os-core Extraction Worker (short: "EW") is to
parallelize retrieving distributed information from various data sources by
abstracting away the complexity of scaling processes accross a distributed
system such as e.g. multiple node.js
[`Worker`](https://nodejs.org/api/worker_threads.html) threads.

## Interface

A single interface allows sending new jobs to the music-os-core `Worker`. Using
[`postMessage`](https://nodejs.org/api/worker_threads.html#workerpostmessagevalue-transferlist)
and by sending a specific Extractor Worker JSON message object, within a
reasonable timeframe, the worker will send back the retrieved record.

## Versioning

The API uses [semantic versioning](https://semver.org/) to identify temporally
different manifestations of the API.

### Status Of This Document

The goal is to keep this document up-to-date with the actual implementation of
the Extractor Worker API. If you find this document out-of-date, please
consider
[contributing](https://github.com/music-os/music-os-core/blob/main/contributing.md).

## Extractor Worker Flow

The Extractor Worker JSON Message Object is sent via
[`postMessage`](https://nodejs.org/api/worker_threads.html#workerpostmessagevalue-transferlist)
to a `Worker` instance. An answer of this message can then be expected
within a reasonable timeframe. The EW implements a minimal queue, which is why
a weak prioritization of submitted tasks is to expect.

Below is a sequence diagram of the entire flow:

<p align="center">
  <img src="/assets/diagrams/extractorworkerflow.png" />
</p>

## JSON Message Object

The JSON object that is sent to a `Worker` via
[`postMessage`](https://nodejs.org/api/worker_threads.html#workerpostmessagevalue-transferlist)
is versioned using semver and schematized via JSON schema. To keep things
easily updatable, for now see [api.mjs](./api.mjs) `const schema` to get an
idea of what structure is mandated.
