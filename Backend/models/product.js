import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true, // global unique product identifier
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    tags: [
      {
        type: String,
        index: true
      }
    ],

    unitSize: {
      type: Number, // e.g. 500
      required: true
    },

    unitType: {
      type: String,
      enum: ["weight", "volume", "piece"],
      required: true
    },

    basePrice: {
      type: Number,
      required: true
    },

    imageUrl: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    featuredCategory:[
      {
        type: String,
        required: true,
        default: "daily",
        index: true
      }
    ]
  },
  { timestamps: true }
);



export default mongoose.model("Product", productSchema);
