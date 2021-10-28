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
  store: new preciseMemory(15 * 60 * 1000), // Use the same as windowMs
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
```
