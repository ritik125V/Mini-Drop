import { Router } from "express";
import {registerWarehouse,addProductToWarehouse,getCurrentInventory }  from "./services/user/storeOperator/store_operator.js";
import getWarehouseInfo from "./services/admin/warehouse-info/get_warehouse.js";
import nearestStore from "./services/user/customers/store_locator.js";
import {getAllProducts , updateFeaturedProduct_Status , UpdateFeaturedCategory } from "./services/admin/products/products.js";
import {operatorLogin , operatorSignUp} from "./services/user/storeOperator/operator_login.js"
import searchProduct from "./services/universal/search_product.js"
import { getProductInfo,userSearchQuery } from "./services/user/customers/product_info.js";
import {placeOrder ,getOrders,trackOrder} from './services/user/customers/order_services.js'
import {createCustomerProfile , loginCustomer ,getUserProfile } from "./services/user/customers/profile_services.js"
import {getWarehouseOrders ,updateOrderStatus , getOrderInfo} from './services/user/storeOperator/order_services.js'
import {FeaturedProducts} from './services/user/customers/add_on_services.js'
import tokenMiddleware from "./middleware/user_auth_middleware.js";



const router = Router();

// user routes
router.post("/customers/nearest-store", nearestStore);
router.get("/customers/product-info",tokenMiddleware, getProductInfo);
router.post("/customer/place-order" , tokenMiddleware ,placeOrder)
router.post("/customer/create-profile", createCustomerProfile)
router.get("/customer/search-query", userSearchQuery)
router.get("/customer/get-orders" ,tokenMiddleware ,getOrders)
router.get("/customer/track-order" , trackOrder)
router.get("/customer/featured-products" , FeaturedProducts)
router.post("/customer/login" , loginCustomer)
router.get("/customer/profile" , tokenMiddleware , getUserProfile)


// store operator routes
router.post("/warehouse/register-warehouse", registerWarehouse);
router.post("/warehouse/store-operator/signup", operatorSignUp);
router.post("/warehouse/store-operator/login", operatorLogin);
router.post("/warehouse/add-product", addProductToWarehouse);
router.get("/warehouse/current-inventory", getCurrentInventory);
router.get("/warehouse/get-orders" , getWarehouseOrders)
router.put("/warehouse/update-order-status" , updateOrderStatus)
router.get("/warehouse/order-info" , getOrderInfo)
router.get("/warehouse/product-info" , getProductInfo)

// admin routes
router.get("/admin/warehouses-info", getWarehouseInfo);
router.get("/admin/products", getAllProducts);
router.put("/admin/update-product-status" , updateFeaturedProduct_Status)
router.put("/admin/update-featured-category" , UpdateFeaturedCategory)




// universal routes
router.get("/search-products", searchProduct);

router.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "pong"
  }).status(200);
});

export default router;