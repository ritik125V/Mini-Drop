import {StoreOperator} from '../../../models/profiles.js'


async function operatorSignUp(req ,res){
    console.log("operator signup req recieved..........");
    try {
        const {operatorId,name,email, phone, password, role, warehouseId} = req.body;
        if(!email || !phone || !password ){
            return res.status(400).json({
                success: false,
                message: "Email, phone and password are required"
            });
        }
        const existingOperator = await StoreOperator.findOne({$or: [{email: email.toLowerCase()}, {phone}]});
        if(existingOperator){
            return res.status(409).json({
                success: false,
                message: "Operator with given email or phone already exists"
            });
        }
        const newOperator = new StoreOperator({
            operatorId,
            name,
            email:  email.toLowerCase(),
            phone,  
            password,
            warehouseId: warehouseId ,
            role:role
        });
        await newOperator.save();

    } catch (error) {
        console.log("error in operator signup service.....");
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}



async function operatorLogin(req, res) {
    console.log("operator login req recieved..........");
    try {
        const { email, password } = req.body;
        if (!email ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }   
        const operator = await StoreOperator.findOne({ email: email.toLowerCase() });
        if (!operator) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }  


        // -----------------------
        // for future password implementation
        // const isPasswordValid = await operator.comparePassword(password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid email or password"
        //     });
        // }
        // // Update last login time
        // operator.lastLoginAt = new Date();
        // await operator.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            profile: operator
        });
    }   catch (error) {
        console.log("error in operator login service.....");
        return res.status(500).json({   
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }   

}


export {operatorLogin ,operatorSignUp};