import mongoose from "mongoose";

const storeOperatorSchema = new mongoose.Schema(
  {
    operatorId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["owner", "manager", "staff"],
      default: "manager"
    },

    // Dark stores this operator manages
    warehouseId:{
        type: String,
        required: true
    },
    permissions: {
      manageInventory: {
        type: Boolean,
        default: true
      },
      manageOrders: {
        type: Boolean,
        default: true
      },
      manageStaff: {
        type: Boolean,
        default: false
      },
      viewAnalytics: {
        type: Boolean,
        default: false
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const userProfileSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  phone:{
    type: Number,
    required: true,
    unique: true
  },
  address:[
    {
      title: {
        type: String,
        required: true
      },
      coordinates:{
        type: [Number], // [longitude, latitude]
        required: true
      },
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: {
        type: String
      },
      city: {
        type: String,  
    } ,
      state: {
        type: String,
      },
    },
  ],
  orders:[
    {

    }
  ]
},{ timestamps: true });


const StoreOperator = mongoose.model("StoreOperator", storeOperatorSchema);
const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export { StoreOperator, UserProfile };