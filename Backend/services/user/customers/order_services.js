import { UserProfile } from "../../../models/profiles.js";
import { Order } from "../../../models/order.js";
import mongoose from "mongoose";
import Inventory from "../../../models/inventory.js";
import Product from "../../../models/product.js";
import warehouse from "../../../models/warehouse.js";
import { getIO } from "../../../ws/index.js";
import redisServer from "../../../redis_server/redis_server.js";
import { cacheStatus } from "../../../redis_server/cacheStatus.js";

async function placeOrder(req, res) {
  console.log("placeOrder active");
  try {
    const userId = req.user.userId;
    const { warehouseId, products, addressId } = req.body;
    if (
      !userId ||
      !warehouseId ||
      !addressId ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      console.log("Invalid order data");
      return res.status(400).json({
        success: false,
        message: "Unable to place order",
      });
    }


    // db req -1: get customer profile
    const customer = await UserProfile.findById(userId);
    if (!customer) {
      console.log("Customer not found");
      return res.status(401).json({
        success: false,
        message: "Please login to place order",
      });
    }
    const deliveryAddress = customer.address.find(
      (add) => add._id.toString() === addressId,
    );

    if (!deliveryAddress) {
      console.log("Invalid delivery address");
      return res.status(400).json({
        success: false,
        message: "Invalid delivery address",
      });
    }

    // \ check inventory

    for (const product of products) {
      console.log("Product in order : ", product);
      const productStatus = await cacheStatus(
        `inventory:${warehouseId}:${product.productId}`,
      );
      if (!productStatus) {
        console.log("Inventory cache miss, checking DB");
        // (coditonal) db req -2: check inventory for each product
        const inventory = await Inventory.findOne({
          warehouseId,
          productId: product.productId,
        });
        // for further stock: { $gte: product.quantity },
        if (!inventory) {
          // also fail if no inventory record
          console.log("Insufficient stock for product", product.productId);
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}`,
          });
        }
      } else {
        console.log(
          "Using cached inventory , product.quantity:",
          product.quantity,
        );
        const updatedStock = await redisServer.hincrby(
          `inventory:${warehouseId}:${product.productId}`,
          "stock",
          -product.quantity,
        );
        console.log("updatedStock : ", updatedStock);
        if (updatedStock < 0) {
          return res.status(411).json({
            success: false,
            message: `Insufficient stock for product ${product.name}`,
          });
        }
      }
    }
    //  db req -3: create order
    const newOrder = await Order.create({
      warehouseId,
      products,
      status: "pending",
      customer: {
        userId: customer._id,
        name: customer.username,
        phone: customer.phone,
        deliveryAddress: {
          title: deliveryAddress.title,
          addressLine1: deliveryAddress.addressLine1,
          addressLine2: deliveryAddress.addressLine2,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          coordinates: deliveryAddress.coordinates,
        },
      },
    });

    const io = getIO();
    io.to(`warehouse_${warehouseId}`).emit("new-order", {
      notification: "new order comming",
      refresh: true,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getOrders(req, res) {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ "customer.userId": userId }).populate();
    return res.status(200).json({
      success: true,
      orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function trackOrder(req, res) {
  try {
    const { orderId } = req.query;
    console.log("track order : ", orderId);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    console.log("order found", order.status);
    const io = getIO();
    io.to(`order_${orderId}`).emit("order-status-updated", {
      orderId,
      status: order.status,
      updatedAt: new Date(),
    });
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export { placeOrder, getOrders, trackOrder };
