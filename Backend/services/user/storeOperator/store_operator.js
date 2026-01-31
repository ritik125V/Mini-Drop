import Warehouse from "../../../models/warehouse.js";
import Inventory from "../../../models/inventory.js";

async function registerWarehouse(req, res) {
    console.log("warehouse resgister req recieved..........");
    
  try {
    const {
      warehouseId,
      name,
      address,
      city,
      state,
      pinCode,
      latitude,
      longitude,
      coverageRadius, // in meters
      capacity
    } = req.body;

    if (
      !warehouseId ||
      !name ||
      !address ||
      !city ||
      !state ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !coverageRadius
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required fields"
      });
    }

    const existingWarehouse = await Warehouse.findOne({ warehouseId });
    if (existingWarehouse) {
      return res.status(409).json({
        success: false,
        message: "Warehouse already registered"
      });
    }

    const warehouse = await Warehouse.create({
      warehouseId,
      name,
      address,
      city,
      state,
      pinCode,
      location: {
        type: "Point",
        coordinates: [longitude, latitude] // 🔥 lng first, lat second
      },
      coverageRadius,
      capacity
    });

    return res.status(201).json({
      success: true,
      message: "Warehouse registered successfully",
      warehouse
    });

  } catch (error) {
    console.error("Warehouse registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

async function addProductToWarehouse(req, res) {
  try {
    const { warehouseId, productId, quantity, tags, name } = req.body;

    console.log(
      "data to addProductToWarehouse",
      warehouseId,
      productId,
      quantity,
      tags,
      name
    );

    // ✅ Proper validation
    if (
      !warehouseId ||
      !productId ||
      typeof quantity !== "number" ||
      !Array.isArray(tags) ||
      !name
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required fields",
      });
    }

    const warehouse = await Warehouse.findOne({ warehouseId });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    const inventoryRecord = await Inventory.create({
      warehouseId,
      productId,
      name,
      stock: quantity,
      tags,
    });

    console.log("product added");

    return res.status(201).json({
      success: true,
      message: "Product added to warehouse inventory",
      inventoryRecord,
    });
  } catch (error) {
    console.error("error arrived", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function getCurrentInventory(req , res) {
 
  try {
    const { warehouseId } = req.query;
     console.log("fetching inventory : " , warehouseId);
    const inventory = await Inventory.find({ warehouseId });
    return res.status(200).json({
      success: true,
      inventory: inventory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      inventoryCount: inventory.length
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
  
}


export { registerWarehouse , addProductToWarehouse, getCurrentInventory};