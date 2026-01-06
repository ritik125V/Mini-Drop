import Product from "../../../models/product";

async function createProduct(req, res) {
  try {
    const {
      productId,
      name,
      brand,
      category,
      tags,
      unitSize,
      unitType,
      basePrice,
      imageUrl
    } = req.body;

    
    if (!productId || !name || !category || !unitSize || !unitType || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists"
      });
    }

    const product = await Product.create({
      productId,
      name,
      brand,
      category,
      tags,
      unitSize,
      unitType,
      basePrice,
      imageUrl
    });
    
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export default createProduct;
