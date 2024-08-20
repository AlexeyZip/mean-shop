const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");
const OrdersController = require("../controllers/orders");

router.post("/order", checkAuth, OrdersController.createOrder);
router.get("/orders", checkAuth, checkAdmin, OrdersController.getOrders);
router.get("/order/:id", checkAuth, OrdersController.getOrderById);
router.put("/order/:id", checkAuth, OrdersController.updateOrder);
router.delete("/order/:id", checkAuth, OrdersController.deleteOrder);

module.exports = router;
