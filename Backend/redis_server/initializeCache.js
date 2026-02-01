import warehouse from "../models/warehouse.js";
import redisServer from "../redis_server/redis_server.js";
import connectMongo from "../mongo_DB.js";
import Product from "../models/product.js";
import Inventory from "../models/inventory.js";

//  smaple inventory data = [
//   {
//     _id: new ObjectId('695b6fc1a486056bd997d8d7'),
//     warehouseId: 'WH_DEL_001',
//     productId: 'PROD-045',
//     stock: 20,
//     tags: [ 'chilli powder', 'mdh', 'spice' ],
//     createdAt: 2026-01-05T08:01:05.057Z,
//     updatedAt: 2026-01-05T08:01:05.057Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('695b6fcda486056bd997d8dc'),
//     warehouseId: 'WH_DEL_001',
//     productId: 'PROD-043',
//     stock: 20,
//     tags: [ 'baby powder', 'himalaya', 'baby care' ],
//     createdAt: 2026-01-05T08:01:17.781Z,
//     updatedAt: 2026-01-05T08:01:17.781Z,
//     __v: 0
//   }]
async function isRedisConnected() {
  try {
    if (redisServer) {
      await redisServer.ping();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Redis connection error:", error);
    return false;
  }
}



async function warehouseLocationCache() {
  try {
    console.log("accessing redis server");
    const isWarehouseCachePresent = await redisServer.exists("warehouse");
    if (isWarehouseCachePresent == 1) {
      console.log("warehouse coordinates cache already present");
    } else {
      const warehouses = await warehouse.find(
        {},
        { warehouseId: 1, location: 1 }
      );

      console.log("warehouses info:", warehouses.length);
      for (const wh of warehouses) {
        const [lng, lat] = wh.location.coordinates;
        await redisServer.hmset(`warehouse:data:${wh.warehouseId}`, {
          warehouseId: wh.warehouseId,
          name: wh.name,
          status: wh.status,
          lat,
          lng,
          address: wh.address || "",
          city: wh.city || "",
        });
        await redisServer.geoadd("warehouse", lng, lat, wh.warehouseId);
      }
      console.log("✅ Warehouses cached in Redis (GEO)");
    }
  } catch (error) {
    console.error("Redis warehouse cache error:",);
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
      const productKey = `product:${product.productId}`;

      await redisServer.set(productKey, JSON.stringify(product));

      await redisServer.sadd("products:all", product.productId);

      await redisServer.sadd(
        `products:category:${product.category.replace(/\s/g, "")}`,
        product.productId
      );
    }

    console.log(`🚀 Cached ${products.length} products in Redis`);
  } catch (error) {
    console.error("Redis product cache error:", error.message);
  }
}

async function inventoryCache() {
  try {
    console.log("inventoryCache initialised ");
    // check if cache present

    const inventoryDate = await Inventory.find();
    console.log("inventory data : ", inventoryDate.length);
    for (const inv of inventoryDate) {
      console.log("inv : ", inv.productId);
      await redisServer.hmset(`inventory:${inv.warehouseId}:${inv.productId}`, {
        warehouseId: String(inv.warehouseId),
        productId: String(inv.productId),
        stock: Number(inv.stock),
        tags: JSON.stringify(inv.tags),
        priceOverride:
          inv.priceOverride != null ? String(inv.priceOverride) : "",
      });
    }
  } catch(error) {
    console.log("error in inventoryCache : ", error.message);
  }
}

connectMongo();
inventoryCache();


// `inventory:${inv.warehouseId}:${inv.productId}`
// warehouse:data:<id>  - warehouse info cache

export { warehouseLocationCache, productCache };
