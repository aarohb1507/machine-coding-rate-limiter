import TokenBucketManager from "./manage";

const limiter = new TokenBucketManager(10, 1)

export const rateLimitMiddleware = (req, res, next)=> {
    const userId = req.ip 
    if(!limiter.isAllowed(userId)){
        return res.status(429).json({
            Success: 'false',
            message: 'limit reached, wait for some time!'
        })
    }
    next()
}