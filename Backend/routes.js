import { Router } from "express";
import {registerWarehouse,addProductToWarehouse,getCurrentInventory }  from "./services/user/storeOperator/store_operator.js";
import getWarehouseInfo from "./services/admin/warehouse-info/get_warehouse.js";
import nearestStore from "./services/user/customers/store_locator.js";
import getAllProducts from "./services/admin/products/products.js";
import {operatorLogin , operatorSignUp} from "./services/user/storeOperator/operator_login.js"
import searchProduct from "./services/universal/search_product.js"
import { getProductInfo,userSearchQuery } from "./services/user/customers/product_info.js";
import {placeOrder ,getOrders,trackOrder} from './services/user/customers/order_services.js'
import {createCustomerProfile} from "./services/user/customers/profile_services.js"
import {getWarehouseOrders ,updateOrderStatus} from './services/user/storeOperator/order_services.js'

const router = Router();

// Define your routes here
// user routes
router.post("/customers/nearest-store", nearestStore);
router.get("/customers/product-info", getProductInfo);
router.post("/customer/place-order" , placeOrder)
router.post("/customer/create-profile", createCustomerProfile)
router.get("/customer/search-query", userSearchQuery)
router.get("/customer/get-orders" , getOrders)
router.get("/customer/track-order" , trackOrder)


// store operator routes
router.post("/warehouse/register-warehouse", registerWarehouse);
router.post("/warehouse/store-operator/signup", operatorSignUp);
router.post("/warehouse/store-operator/login", operatorLogin);
router.post("/warehouse/add-product", addProductToWarehouse);
router.get("/warehouse/current-inventory", getCurrentInventory);
router.get("/warehouse/get-orders" , getWarehouseOrders)
router.post("/warehouse/update-order-status" , updateOrderStatus)


// admin routes

router.get("/admin/warehouses-info", getWarehouseInfo);
router.get("/admin/products", getAllProducts);


// universal routes
router.get("/search-products", searchProduct);

router.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "pong"
  }).status(200);
});

export default router;