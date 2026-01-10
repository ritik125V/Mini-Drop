import {Redis} from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redisServer = new Redis(process.env.REDIS_URL)

export default redisServer
