import Product from "../../../models/product.js";
import { FeaturedCategory } from "../../../models/add_on.js";

async function getAllProducts(req, res) {
    console.log("get all product req recieved........");
    
    try {
        const products = await Product.aggregate([
        { $match: { isActive: true } }, // optional filter
        { $sample: { size: 25 } }
        ])
        return res.status(200).json({
            success: true,
            products
        }); 
    } catch (error) {
        console.log("error in get all product service.....");
        
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }                   

}


async function updateFeaturedProduct_Status (req,res){
    try {
        const {productId  , featureCategory , isFeatured} = req.query;
        if (!productId) {
            return res.status(400).json({
              success: false,
              message: "Product ID is required"
            });
          }
        const product = await Product.findByIdAndUpdate(productId , 
            {isFeatured: isFeatured,
                $addToSet: { featuredCategory: featureCategory }},
             {new:true}  )
        return res.status(200).json({
            success:true,
            message:"updated successfully"
        })

    } catch (error) {
        console.log("error in updateFeaturedProduct_Status" , error);
        return res.status(404).json({
            success:false,
            error:error.message
        })
    }
    
}

async function UpdateFeaturedCategory (req,res){
   try {
    console.log("req at UpdateFeaturedCategory")
     const {featuredCategory}  = req.query;
     if (!featuredCategory) {
         return res.status(400).json({
           success: false,
           message: "Featured Category is required"
         });
       }
       const category = await FeaturedCategory.findByIdAndUpdate("695e5534fa3b4a6043de75ac",{
         featuredCategory: featuredCategory
       })
       return res.status(200).json({
         success:true,
         message:"updated successfully"
       })

   } catch (error) {
        console.log("error in updateFeaturedCategory" , error);
   }

}



export { getAllProducts , updateFeaturedProduct_Status , UpdateFeaturedCategory };

