import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


async function tokenMiddleware(req, res, next) {
  try {
    const token = req.cookies?.mdtoken;
    console.log("token : " , res.cookies);
    
    if (!token) {
      console.log("no token present" ,token);
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // req.user.userId stores userId
    
    next();

  } catch (error) {
    console.error("Token verification error:", error);  
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token"
    });
  }
}


export default tokenMiddleware;