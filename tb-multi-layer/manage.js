import TokenBucket from "./token-bucket"

class TokenBucketManager {
    constructor(capacity, refillRate){
        this.capacity = capacity
        this.refillRate = refillRate
        this.buckets = new Map()
    }
    getUser(userId){
        if(!this.buckets.has(userId)){
            this.buckets.set(userId, new TokenBucket(this.capacity, this.refillRate))
        }
        return this.buckets.get(userId)
    }
    isAllowed(userId){
        const bucket  = this.getUser(userId)
        return bucket.consume()
    }

}
export default TokenBucketManager