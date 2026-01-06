import Product from "../../../models/product.js";

async function searchProduct(req, res) {
  try {
    const { query } = req.query;

    // 1️⃣ Validate query
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }

    const normalizedQuery = query.toLowerCase().trim();

    // 2️⃣ Search using indexed tags
    const products = await Product.find(
      {
        tags: { $in: [normalizedQuery] },
        isActive: true
      },
      {
        _id: 0,          // optional: hide internal id
        productId: 1,
        name: 1,
        imageUrl: 1,
        basePrice: 1,
        unitSize: 1,
        unitType: 1,
        tags: 1
      }
    ).limit(50);

    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("Product search error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

export default searchProduct;
