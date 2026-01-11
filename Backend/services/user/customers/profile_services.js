import { UserProfile } from '../../../models/profiles.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

async function createCustomerProfile(req, res) {
  try {
    console.log("createCustomerProfile active   ");
    
    const { username, email, phone, address, password} = req.body;

    if (
      !password ||
      !username ||
      !email ||
      !phone ||
      !Array.isArray(address) ||
      address.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data"
      });
    }

    const existingUser = await UserProfile.findOne({
      $or: [{ email }, { phone }]
    });
    console.log("existingUser : " , existingUser); 
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserProfile.create({
      username,
      password: hashedPassword,
      email,
      phone,
      address
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    return res.cookie("mdtoken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(201).json({
      success: true,
      message: "Customer created successfully",
      user
    })
    
  } catch (error) {
    console.error("Create Customer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function loginCustomer(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data"
      });
    }

    const user = await UserProfile.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("mdtoken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax"
      })
      .status(200)
      .json({
        success: true,
        message: "Customer logged in successfully",
        user: {
          _id: user._id,
          phone: user.phone
        }
      });

  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}



export  {createCustomerProfile , loginCustomer};
