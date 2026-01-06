import Warehouse from "../../../models/warehouse.js";

async function nearestStore(req, res) {
    console.log("Nearest store request received...");
  try {
    const { user_coordinates } = req.body;
    console.log("user coordinates: " , user_coordinates);
    
    if (
      !user_coordinates ||
      typeof user_coordinates.lat !== "number" ||
      typeof user_coordinates.lng !== "number"
    ) {
      return res.status(400).json({
        message: "Valid user coordinates are required"
      });
    }

    const store = await Warehouse.findOne({
      status: "active",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [user_coordinates.lng, user_coordinates.lat]
          },
          $maxDistance: 5000 // 5km in meters
        }
      }
    });

    if (!store) {
        console.log("no store found nearby");
        
      return res.status(404).json({
        success:false,
        message: "No active stores found nearby"
      });
    }

   else{
    console.log("store found nearby");
    return res.status(200).json({
        swccess: true,
      message: "Nearest store found",
      store
    });}

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

export default nearestStore;
