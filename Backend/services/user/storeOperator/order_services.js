import { Order } from "../../../models/order.js";
import { getIO } from "../../../ws/index.js";




async function getWarehouseOrders(req , res) {
    try {
        const {warehouseId} = req.query
        if(!warehouseId){
            return res.status(400).json({
                success:false,
                message : "no warehouse id provided"
            })
        }
        console.log("warehouse Id : " , warehouseId);
        
        const orders = await Order.find({
            warehouseId : warehouseId
        }).sort({createdAt: -1})
        return res.status(200).json({
            success : true,
            orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:"internal error"
        })
    }
}   

async function updateOrderStatus(req, res) {
  try {
    console.log("updateOrderStatus req received");

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId / status is missing",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    const io = getIO();
    io.to(`order_${orderId}`).emit("order-status-updated", {
      orderId,
      status: order.status,
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "order status updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
}


async function getOrderInfo(req, res) {
  try {
    const orderId = req.query.orderId;

    const order = await Order.findById(orderId).populate("customer");
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export {getWarehouseOrders , updateOrderStatus , getOrderInfo}