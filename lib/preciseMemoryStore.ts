import {Store, IncrementResponse, Options, ValueDeterminingMiddleware} from "express-rate-limit"

function time(): number {
    return Date.now();
}

function calculateNextResetTime(windowMs: number, user: User): Date {
    return new Date((windowMs - (time() - user.ts)) + time())
}

interface hits {
    [key: string]: User
}

function getDict(): any {
    return new Proxy({}, {
        get: (target: hits, name: string) => name in target ? target[name] : new User()
    });
}

class User {
    hits: number
    ts: number

    constructor() {
        this.hits = 0
        this.ts = Date.now()
    }
}

class MemoryStore implements Store {
    windowMs!: number
    hits!: hits
    max!: number | ValueDeterminingMiddleware<number>

    constructor(max: number | ValueDeterminingMiddleware<number>) {
        this.max = max
    }

    init(options: Options) {
        this.windowMs = options.windowMs
        this.hits = getDict()

        setInterval(() => {
            for (let k in this.hits) {
                let v = this.hits[k]
                if (v.ts + this.windowMs <= time()) {
                    delete this.hits[k]
                }
            }
        }, 60000);
    }

    increment(key: string): IncrementResponse {
        let user = this.hits[key]
        let reset = calculateNextResetTime(this.windowMs, user)
        if (user.ts + this.windowMs <= time()) {
            user.hits = 0
        }
        if (user.hits > this.max) {
            return {
                totalHits: user.hits,
                resetTime: reset
            }
        }
        user.hits++
        user.ts = time()
        this.hits[key] = user
        return {
            totalHits: user.hits,
            resetTime: reset
        }
    }

    decrement(key: string) {
        let user = this.hits[key]
        if (user.hits <= 0) {
            return
        }
        user.hits--
        this.hits[key] = user
    }

    resetAll() {
        this.hits = getDict()
    }

    resetKey(key: string) {
        delete this.hits[key]
    }
}

export default MemoryStore
