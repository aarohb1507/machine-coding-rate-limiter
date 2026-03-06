//make a class object, for per user data storage
//when a request comes, extract the ip from the user, check whether or not in the map, if in the map, check the capacity "after" the simulating the leak
//the leak shud only be simulated, on the per req basis, but simulated in the manner to resemble a real leak, which mean from the last current level, subtract the leak, by calculating the time * rate

class LeakyBucket {
    constructor(capacity, leakRate){
        this.capacity = capacity
        this.leakRate = leakRate
        this.currentLevel = 0
        this.lastLeak = Date.now()
    }
    leak(){
        const now = Date.now()
        const timeElapsed = now - this.lastLeak
        const leak = timeElapsed * this.leakRate
        this.currentLevel = Math.max(0, this.currentLevel-leak)
        this.lastLeak = now
    }
    isAllowed(){
        this.leak()
        if(this.currentLevel + 1 > capacity){
            return{
                allowed: false,
                remaining: Math.floor(this.capacity - this.currentLevel)
            }
        }
        this.currentLevel+=1
        return{
            allowed: true,
            remaining: Math.floor(this.capacity - this.currentLevel)
        }
    }
}