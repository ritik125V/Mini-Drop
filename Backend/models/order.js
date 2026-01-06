import mongoose from "mongoose";
import {UserProfile} from "./profiles.js";

const orderSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          // required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        priceAfterDiscount: {
          type: Number,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
    //   required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "packing",
        "out for delivery",
        "delivered",
        "cancelled",
        "accepted",
        "rejected"
      ],
      default: "pending",
    },
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      deliveryAddress: {
        title: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);
export { Order};