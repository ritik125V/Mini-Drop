import Warehouse from "../../../models/warehouse.js";
import redisServer from "../../../redis_server/redis_server.js";


async function nearestStore(req, res) {
  console.log("Nearest store request received...");

  try {
    const { user_coordinates } = req.body;

    if (
      !user_coordinates ||
      typeof user_coordinates.lat !== "number" ||
      typeof user_coordinates.lng !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid user coordinates are required",
      });
    }

    const { lat, lng } = user_coordinates;

    let redisResult = null;
    let redisFailed = false;

    // 1️⃣ Try Redis (non-blocking)
    try {
      redisResult = await redisServer.georadius(
        "warehouse",
        lng,
        lat,
        5,
        "km",
        "WITHDIST",
        "ASC",
        "COUNT",
        1
      );
    } catch (error) {
      redisFailed = true;
      console.error("Redis georadius error:", error.message);
    }

    // 2️⃣ If Redis failed OR no data → MongoDB fallback
    if (redisFailed || !redisResult || redisResult.length === 0) {
      console.log("Falling back to MongoDB");

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
    }

    // 3️⃣ Redis hit → fetch full data from MongoDB
    const [nearestWarehouseId, distanceKm] = redisResult[0];

    const store = await Warehouse.findOne({
      warehouseId: nearestWarehouseId,
      status: "active",
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "No active stores found nearby",
      });
    }

    return res.status(200).json({
      success: true,
      source: "redis",
      distanceKm,
      store,
    });

  } catch (error) {
    console.error("Nearest store error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


export default nearestStore;
