import Redis from 'ioredis'
const redisClient = new Redis()

export const tokenBucketLimiter = ({maxTokens, refillRateInMs})=> {
    return async function(req, res, next){
        try{
            const ip = req.ip
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
                    const elapasedTime = now - bucket.lastRefill
                    const newTokens = elapsedTIme*refillRateInMs
                    bucket.tokens = Math.min(maxTokens, newTokens)
                    bucket.lastRefill = now
                }
                const tokens = bucket.tokens
                if(tokens<1){
                    return res.status(429).json(
                        {
                            Success: "False",
                            message: "You dont have enough tokens"
                        }
                    )
                }
                bucket.tokens-=1
                await redisClient.set('key', JSON.stringify(bucket))
                next()
            }
        }catch(err){
            console.error(err.message)
            return res.status(500).json({
                message: "An error occured"
            })
            next()
        }
    }
}