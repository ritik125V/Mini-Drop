import Product from "../../../models/product.js";
import {  FeaturedCategory } from "../../../models/add_on.js";

async function FeaturedProducts(req, res) {
  console.log("req : FeaturedProducts");
  const login_status = req.login_status || false;
  try {
    // 1. Get only featuredCategory values
    const featuredCategories = await FeaturedCategory
      .find({})
    console.log("featuredCategories : " , featuredCategories);
    const categories = featuredCategories.map(
      item => item.featuredCategory
      
    );
    console.log("categories ; " , categories);
    

    if (!categories.length) {
      return res.status(200).json({
        success: false,
        message: "No featured categories found",
        login_status
      });
    }

    // 3. Aggregate featured products
    const products = await Product.aggregate([
      {
        $match: {
          isFeatured: true,
          featuredCategory: { $in: categories }
        }
      },
      { $sample: { size: 25 } }
    ]);
    console.log("products found:", products.length);


    return res.status(200).json({
      success: true,
      count: products.length,
      products
      ,login_status
    });

  } catch (error) {
    console.error("error in get all product service:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


export { FeaturedProducts};