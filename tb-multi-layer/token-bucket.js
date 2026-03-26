class TokenBucket {
    constructor(capacity, refillRate){
        this.capacity = capacity
        this.refillRate = refillRate
        this.lastRefill = Date.now()
        this.tokens = capacity
    }
    refill(){
        const now = Date.now()
        const timeElapsed = now - this.lastRefill
        const refillTokens = timeElapsed * this.refillRate
        this.tokens = Math.min(this.capacity, this.tokens + refillTokens)
        this.lastRefill = now
    }
    consume(){
        this.refill()
        if(this.tokens >= 1){
            this.tokens -= 1
            return true
        }else{
            return false
        }

    }
}