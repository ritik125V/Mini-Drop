import Warehouse from "../../../models/warehouse.js";
import redisServer from "../../../redis_server/redis_server.js";


async function nearestStore(req, res) {
  console.log("Nearest store request received...");

  try {
    const { user_coordinates } = req.body;
    console.log("user coordinates:", user_coordinates);

    if (
      !user_coordinates ||
      typeof user_coordinates.lat !== "number" ||
      typeof user_coordinates.lng !== "number"
    ) {
      return res.status(400).json({
        message: "Valid user coordinates are required",
      });
    }

    const { lat, lng } = user_coordinates;
    // redis data
    const redisResult = await redisServer.georadius(
      "warehouse",
      lng,
      lat,
      5,
      "km",
      "WITHDIST",
      "ASC",
      "COUNT",
      2
    );

    console.log("Redis nearest result:", redisResult);

    if (!redisResult || redisResult.length === 0) {
      console.log("No warehouse found in Redis cache");
    } else {
      const nearestWarehouseId = redisResult[0][0];
      const distanceKm = redisResult[0][1];

      console.log(
        `Nearest warehouse from Redis: ${nearestWarehouseId} (${distanceKm} km)`
      );

        //  2️⃣ MongoDB: Fetch full warehouse data

      const store = await Warehouse.findOne({
        warehouseId: nearestWarehouseId,
        status: "active",
      });

      if (store) {
        return res.status(200).json({
          success: true,
          source: "redis",
          distanceKm,
          store,
        });
      }
    }

    /* =========================
       3️⃣ FALLBACK: MongoDB GEO query
       ========================= */
    console.log("Falling back to MongoDB geo query...");

    const store = await Warehouse.findOne({
      status: "active",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000,
        },
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "No active stores found nearby",
      });
    }

    return res.status(200).json({
      success: true,
      source: "mongodb",
      store,
    });

  } catch (error) {
    console.error("Nearest store error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


export default nearestStore;
