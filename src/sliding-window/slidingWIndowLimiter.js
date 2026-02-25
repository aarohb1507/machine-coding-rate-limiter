import redis from 'ioredis'
const redisClient = redis()

export function slidingWindowLimiter({maxRequests, windowInSecs})=>{
    return async function(req, res, next){
        try{
        const ip = req.ip
        const key = `sw:${ip}`
        const now = Date.now()
        const windowStart = now - windowInSecs*1000
        await redisClient.zremrangebyscore(key, 0, windowStart)

        const count = redisClient.zcard(key)
        if(count>maxRequests){
            return res.status(429).json({
                Success: "False",
                timeRemainingForResend: Math.floor((windowInSecs)/1000) - Math.floor((now - windowStart)/1000)
            })
        }
        await redisClient.zadd(key, now, now.toString())
        await redisClient.zadd(key, windowInSecs)
        }catch(error){
            console.error(error)
            return res.status(500).json({
                Success: "False",
                message: "Internal Server Error"
            })
        }
    }
}



