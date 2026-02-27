import Redis from 'ioredis'
const redisClient = new Redis()

export const tokenBucketLimiter = ({maxTokens, refillRateInMs}) => {
    return async function(req, res, next){
        try{
            const req = req.ip
            const key = `tb:${ip}`
            const now = Date.now()
            const bucket = await redisClient.get(key)
            if(!bucket){
                bucket = {
                    tokens: maxTokens,
                    lastRefill: now
                }
            }else{
                bucket = JSON.parse(bucket)
                const elapsed = now - bucket.lastRefill
                const newTokens = elapsed*refillRateInMs
                bucket.tokens = Math.min(maxTokens, bucket.tokens + newTokens)
                bucket.lastRefill = now
            }
            if(bucket.tokens<1){
                return res.status(429).json({
                    success: "False",
                    message: "You dont have enough tokens."
                })
            }
            bucket.token -= 1 
            await redisClient.set(key, JSON.stringify(bucket))
            await redisClient.expire(key, Math.ceil(2*(maxTokens/(refillRateInMs*1000)))
            next()
        }catch(err){
            console.error(err.message)
            next()
        }
    }
}

