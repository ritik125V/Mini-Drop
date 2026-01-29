import redisServer from "./redis_server.js";


async function cacheStatus(key){
    try {
        const status = await redisServer.exists(key)
        if(status == 1 )return true
        else return false
    }catch(error){
        console.log("error in checkig cache statys " , key , "error : " , error)
        return false
    }
}

export {cacheStatus}