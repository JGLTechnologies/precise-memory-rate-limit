# Precise Memory Rate Limit

Precise memory store for [express-rate-limit](https://github.com/nfriedly/express-rate-limit).

[![Npm version](https://img.shields.io/npm/v/precise-memory-rate-limit.svg)](https://www.npmjs.org/package/precise-memory-rate-limit)

### Install

```sh
$ npm install --save precise-memory-rate-limit
```

### Example

```js
const rateLimit = require("express-rate-limit")
const MemoryStore = require("precise-memory-rate-limit")

const max = 10

const limiter = rateLimit({
    store: new MemoryStore(max),
    windowMs: 15 * 60 * 1000,
    max: max // Make sure this is the same as the max passed into the MemoryStore constructor
})

app.use(limiter)
```

precise-memory-ratelimit does not currently support using a middleware for the max
