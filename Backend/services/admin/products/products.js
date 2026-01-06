import Product from "../../../models/product.js";


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

export default getAllProducts;