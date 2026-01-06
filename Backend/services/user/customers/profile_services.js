import { UserProfile } from '../../../models/profiles.js'

async function createCustomerProfile(req, res) {
  try {
    console.log("createCustomerProfile active   ");
    
    const { username, email, phone, address } = req.body;

    if (
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

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }
    const user = await UserProfile.create({
      username,
      email,
      phone,
      address
    });

    return res.status(201).json({
      success: true,
      message: "Customer profile created successfully",
      userId: user._id
    });

  } catch (error) {
    console.error("Create Customer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export  {createCustomerProfile};
