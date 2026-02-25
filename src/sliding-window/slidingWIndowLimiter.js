import redis from 'ioredis'
const redisClient = redis()

export const slidingWindowLimiter = ({windowInSeconds, maxRequests}) => {
    return async function(req, res, next){
        try{
            const ip = req.ip
            const key = `sw:${ip}`
            const now = Date.now()
            const windowStart = now - windowInSeconds*1000
            await redisClient.zremrangebyscore(key,0,windowStart)
            const count = await redisClient.zcard(key)
            if(count >= maxRequests){
                return res.status(429).json({
                    Success: 'False',
                    message: 'You have reached the limit for this window',
                    try_after: windowInSeconds - Math.floor((now - windowStart)/1000)
                })
            }
            await redisClient.zadd(key, now, now.toString())
            await redisClient.expire(key, windowInSeconds)
            next()
        }catch(error){
            console.log(error.message)
            return res.status(500).json({
                message: "The sliding window limiter malfunctioned."
            })
            next()
        }
    }
}

