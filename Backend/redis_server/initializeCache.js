import warehouse from "../models/warehouse.js";
import redisServer from "../redis_server/redis_server.js";
import connectMongo from '../mongo_DB.js'


async function warehouseLocationCache() {
  try {
    console.log("accessing redis server")
    const isWarehouseCachePresent = await redisServer.exists("warehouse");
    if(isWarehouseCachePresent==1){
        console.log('warehouse coordinates cache already present' )
    }
    else{
        const warehouses = await warehouse.find(
      {},
      { warehouseId: 1, location: 1 }
    );

    console.log("warehouses info:", warehouses.length);
    for (const wh of warehouses) {
      const [lng, lat] = wh.location.coordinates;
      await redisServer.hmset(
        `warehouse:data:${wh.warehouseId}`,
        {
          warehouseId: wh.warehouseId,
          name: wh.name,
          status: wh.status,
          lat,
          lng,
          address: wh.address || "",
          city: wh.city || "",
        }
      );
      await redisServer.geoadd(
        "warehouse",
        lng,
        lat,
        wh.warehouseId
      );
      
    }
    console.log("✅ Warehouses cached in Redis (GEO)");
    }
  } catch (error) {
    console.error("Redis warehouse cache error:", error);
  }
}


export {warehouseLocationCache}