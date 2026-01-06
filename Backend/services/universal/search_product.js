import Product from "../../models/product.js";

async function searchProduct(req, res) {
  console.log("search query received");

  try {
    const { query } = req.query;
    console.log("query:", query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    const products = await Product.find({
      $or: [
        { tags: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ]
    })
      .limit(50)
      .lean(); // 🔥 IMPORTANT

    console.log("products found:", products.length);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error("error searching products:", err);

    return res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
}

export default searchProduct;
