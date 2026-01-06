import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    warehouseId: {
      type: String,
      required: true,
      index: true
    },
    name:{
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true,
      index: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },
    tags:[
      {
        type: String,
        required: true
      }
    ],
    priceOverride: {
      type: Number 
    }
  },
  { timestamps: true }
);

inventorySchema.index({ warehouseId: 1, productId: 1 ,tags:1 }, { unique: true });

export default mongoose.model("Inventory", inventorySchema);
