import Warehouse from "../../../models/warehouse.js"


async function getWarehouseInfo(req, res) {
    try {
        const warehouses = await Warehouse.find({});
        return res.status(200).json({
            success: true,
            warehouses
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default getWarehouseInfo;