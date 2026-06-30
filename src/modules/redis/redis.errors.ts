class RedisInitError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        this.name = 'RedisInitError'
    }
}

class RedisConnectionError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        this.name = 'RedisConnectionError'
    }
}

export { RedisConnectionError, RedisInitError }

