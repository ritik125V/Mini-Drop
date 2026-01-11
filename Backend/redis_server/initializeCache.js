import warehouse from "../models/warehouse.js";
import redisServer from "../redis_server/redis_server.js";
import connectMongo from '../mongo_DB.js'
import Product from "../models/product.js";


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

async function productCache() {
  try {
    console.log("accessing redis server");

    // 1️⃣ Check if cache already exists
    const isProductCachePresent = await redisServer.exists("products:all");

    if (isProductCachePresent === 1) {
      console.log("✅ Product cache already present");
      return;
    }

    console.log("⏳ Product cache not found, building cache...");

    // 2️⃣ Fetch products from DB
    const products = await Product.find();

    // 3️⃣ Cache each product
    for (const product of products) {
      const productKey = `product:${product._id}`;

      await redisServer.set(
        productKey,
        JSON.stringify(product)
      );

      await redisServer.sadd(
        "products:all",
        product._id.toString()
      );

      await redisServer.sadd(
        `products:category:${product.category.replace(/\s/g, "")}`,
        product._id.toString()
      );
    }

    console.log(`🚀 Cached ${products.length} products in Redis`);

  } catch (error) {
    console.error("Redis product cache error:", error);
  }
}





export {warehouseLocationCache ,productCache}