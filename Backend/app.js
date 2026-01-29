import express from "express";
import cors from "cors";
import router from "./routes.js";
import connectMongo from "./mongo_DB.js";
import dotenv from 'dotenv';
import { warehouseLocationCache , productCache } from "./redis_server/initializeCache.js";
import cookieParser from "cookie-parser";
import redisServer from "./redis_server/redis_server.js";

dotenv.config();


const allowedOrigins = [
  process.env.ORIGIN_URI_ONE,
  process.env.ORIGIN_URI_TWO
];

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());



app.use(
  cors({
    origin:function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          console.log("Incoming Origin:", origin);
           console.log("Allowed:", allowedOrigins);
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);


// Routes
app.use("/api/v1", router);

app.get("/test-cookie", (req, res) => {
  res.cookie("test", "123", { path: "/" });
  res.send("ok");
});

// DB connection

connectMongo();
warehouseLocationCache()
productCache()

export default app;
