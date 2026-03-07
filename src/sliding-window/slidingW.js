import redis from 'ioredis'
const redisClient = new redis()

export const slidingWindow = ({windowInMs, maxReqs}) => {
    return async function(req, res, next){
        try {
            const ip = req.ip
        const key = `sw:${ip}`
        const now = Date.now()
        windowStart = now - windowInMs
        await redisClient.zremrangebyscore(key, 0, windowStart)
        const count = await redisClient.zcard(key)
        if(count > maxReqs){
            return res.status(429).json({
                Success: 'false',
                message: 'you are out of attempts',
                remaining: count
            })
        }
        await redisClient.zadd(key, now, now.toString())
        await redisClient.expire(key, windowInMs)
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: error.message
            })
        }
    }
}
