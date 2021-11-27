# Precise Memory Rate Limit

Precise memory store for [express-rate-limit](https://github.com/nfriedly/express-rate-limit).

[![Npm version](https://img.shields.io/npm/v/precise-memory-rate-limit.svg)](https://www.npmjs.org/package/precise-memory-rate-limit)

### Install

```sh
$ npm install --save precise-memory-rate-limit
```

### Example

```js
const rateLimit = require("express-rate-limit");
const preciseMemory = require("precise-memory-rate-limit")

const limiter = rateLimit({
  store: new preciseMemory(15 * 60 * 1000, 100),
  windowMs: 15 * 60 * 1000, // Make sure this is the same as the windowMS passed into the preciseMemory constructor
  max: 100 // Make sure this is the same as the maxCalls passed into the preciseMemory constructor
});

app.use(limiter);
```
