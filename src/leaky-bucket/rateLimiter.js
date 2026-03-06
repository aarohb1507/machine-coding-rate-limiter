const buckets = new Map()

const leakyBucket = (req, res, next) => {
    const ip  = req.ip
    let bucket = buckets.get(ip)
    
    if(!bucket){
        const bucket = new LeakyBucket(5, 1)
        buckets.set(ip, bucket)
    }

    const result = bucket.isAllowed()

    if(!result.allowed){
        return res.status(429).json({
            message: "Too many requests",
            remaining: result.remaining
        })
    }
    
    next()
} 