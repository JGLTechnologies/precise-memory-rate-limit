"use strict";

const time = () => {
    return Date.now();
}

function calculateNextResetTime(windowMs) {
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + windowMs);
    return d;
}

class DefaultDict {
    constructor(defaultVal) {
        return new Proxy({}, {
            get: (target, name) => name in target ? target[name] : defaultVal()
        });
    }
}

class User {
    constructor(rate, maxCalls) {
        this.tokens = maxCalls
        this.ts = Date.now()
    }
}

function MemoryStore(windowMs, maxCalls) {
    let hits = new DefaultDict(() => {
        return new User(windowMs, maxCalls)
    });
    let resetTime = calculateNextResetTime(windowMs);

    this.incr = function (key, cb) {
        let user = hits[key]
        if (user.ts + windowMs <= time()) {
            user.tokens = maxCalls
        }
        if (user.tokens <= 0) {
            cb(null, maxCalls + 1, resetTime);
            return
        }
        user.tokens--
        user.ts = time()
        hits[key] = user
        cb(null, maxCalls - 1, resetTime);
    };

    this.decrement = function (key) {
        hits[key].tokens++
    };

    // export an API to allow hits all IPs to be reset
    this.resetAll = function () {
        hits = new DefaultDict(() => {
            return new User(windowMs, maxCalls)
        });
        resetTime = calculateNextResetTime(windowMs);
    };

    // export an API to allow hits from one IP to be reset
    this.resetKey = function (key) {
        delete hits[key];
    };

    setInterval(() => {
        for (let [key, value] of Object.entries(hits)) {
            if (value.ts + windowMs <= time()) {
                delete hits.data[key]
            }
        }
    }, 60000);
}

module.exports = MemoryStore;
