import app from "./app.js";
import http from "http";
import { initSocket } from "./ws/index.js";
const server = http.createServer(app);
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 5000;
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});

