import Product from "../../../models/product.js";
import Inventory from "../../../models/inventory.js";



async function getProductInfo(req, res) {
    
  try {
    const { productId } = req.query;   
    console.log("product id: " , productId);
    
    if (!productId) {
        return res.status(400).json({   
            success: false,
            message: "Product ID is required"
        });
    }
    const productInfo = await Product.findById(productId).lean();
    if (!productInfo) {
        console.log("no product found");
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    } 
    else{   
        return res.status(200).json({
        success: true,
        product: productInfo
    });
    }      
    
  } catch (error) {
    console.error("Error fetching product info:", error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
    }
}


async function userSearchQuery(req, res) {
  console.log("user search query received");

  try {
    const { query , warehouseId } = req.query;
    console.log("query:", query);

    if (!query || !warehouseId) {
      return res.status(400).json({
        success: false,
        message: "Query and warehouseId parameters are required",
      });
    }

    const inventory_search = await Inventory.find({
      warehouseId,
      tags: { $regex: query, $options: "i" },
      stock: { $gt: 1 } 
    })
      .limit(50)
      .lean();
    console.log("products found:", inventory_search.length);
    const productIds = inventory_search.map(item => item.productId);

    
    // get product info from cache 
    
    const products = await Product.find({productId: {$in: productIds}}).lean();
    return res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (err) {
    console.error("error searching products:", err);

    return res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
}

export { getProductInfo, userSearchQuery };
