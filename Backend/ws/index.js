import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
// CONNECTION 
  io.on("connection", (socket) => {     
    console.log("connected to websocket:", socket.id);
    // CUSTOMER SIDE EVENT 
    socket.on("join-order", (orderId) => {
      // JOINS THE ROOM 
      socket.join(`order_${orderId}`);
      console.log(`socket ${socket.id} joined order_${orderId}`);
    });
    socket.on("order-listener",(warehouseId)=>{
      socket.join(`warehouse_${warehouseId}`);
      console.log(`socket ${socket.id} joined warehouse_${warehouseId}`)
    })

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });

  console.log("WebSocket server initialized");
}

export function getIO() {
  try {
    if(io){
      return io 
    }
  } catch (error) {
    console.log(error);
    return null
  }
}
