import Redis from 'ioredis'
const redisClient = Redis()

export function RateLimiter({window, maxRequests}){
    return async function(req, res, next){
        try{
        const ip = req.ip
        const key = `rate-limiter:${ip}`
        const count = await redisClient.incr(key)
        if (count === 1){
            await redisClient.expire(key, window)
        }

        if (count>maxRequests){
            const ttl = await redisClient.ttl(key)
            return res.status(429).json({
                Success: "false",
                message: "You have exceeded the limit",
                retry_after_seconds: ttl
            })
        }
        }catch(err){
            return res.status(500).json({
                message: "Error while limiting", err
            })
        }
        
    }
}

