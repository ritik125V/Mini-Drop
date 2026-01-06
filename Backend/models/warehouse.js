import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    state:{
      type: String,
      required: true
    },
    city:{
      type: String,
      required: true
    },
    pinCode: {
      type: Number,
      required: true
    },
    coverageRadius: {
      type: Number, 
      required: true
    },
    servingPincodes:{
      type: [Number],
      required: true
    },
    capacity: {
      type: Number
    },
    location:{
      type:{
        type: String,
        enum: ['Point'],
        required:true
      },
      coordinates:{
        type:[Number],
        required:true
      },
    },
   
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

warehouseSchema.index({status:1, location: "2dsphere" });
export default mongoose.model("Warehouse", warehouseSchema);
