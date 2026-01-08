import mongoose from "mongoose";


const FeaturedCategoryModel = new mongoose.Schema(
    {
       featuredCategory :{
            type:String,
            required:true,
            default:"daily "
        },
    },{
        timestamps:true
    }
)

FeaturedCategoryModel.index({ featuredCategory: 1 });
const FeaturedCategory = mongoose.model("FeaturedCategory" , FeaturedCategoryModel);

export { FeaturedCategory};