import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


async function tokenMiddleware(req, res, next) {
  try {
    console.log("Incoming cookies:", req.cookies);

    const token = req.cookies?.mdtoken;

    if (!token) {
      console.log("No token present");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Token verification failed");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }
    console.log("Token decoded:", decoded);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token",
    });
  }
}



export default tokenMiddleware;