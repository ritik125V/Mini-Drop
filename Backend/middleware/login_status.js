import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


async function loginStatus(req, res, next) {
  try {
    const token = req.cookies?.mdtoken;

    if (!token) {
      console.log("No token present — loginStatus: false");
      req.login_status = false;
      return next(); // ✅ MUST call next
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;        // decoded.userId etc.
    req.login_status = true;

    return next();             // ✅ continue

  } catch (error) {
    console.error("Token verification error:", error.message);
    req.login_status = false;
    return next();             // ✅ still alx` low request
  }
}


export  {loginStatus};