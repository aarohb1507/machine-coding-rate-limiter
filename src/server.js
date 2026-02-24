import express from 'express'
import { RateLimiter } from './rateLimiter'

const app = express()

app.use(RateLimiter({window: 60, maxRequests: 5}))

app.get('/',(req, res, next)=> {
    return res.status(200).json({
        Success: "OK"
    })
})

app.listen(3000, ()=> {
    console.log("app is listening on 3000")
})