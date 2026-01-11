import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


async function tokenMiddleware(req, res, next) {
  try {
    const token = req.cookies?.mdtoken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // req.user.userId stores userId
    
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token"
    });
  }
}


export default tokenMiddleware;