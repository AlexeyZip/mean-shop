const Order = require("../models/order");
const Product = require("../models/product");

exports.createOrder = (req, res, next) => {
  const products = req.body.products;
  let totalPrice = 0;

  console.log("Received products:", products);

  Product.find({ _id: { $in: products.map((p) => p.productId) } })
    .then((foundProducts) => {
      console.log("Found products:", foundProducts);

      foundProducts.forEach((product) => {
        const orderProduct = products.find((p) => p.productId == product._id);
        totalPrice += product.price * orderProduct.quantity;
      });
      console.log("req------------", req.body);
      const order = new Order({
        products: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        user: req.userData.userId,
        totalPrice: totalPrice,
        deliveryInfo: req.body.deliveryInfo,
      });

      return order.save();
    })
    .then((createdOrder) => {
      res.status(201).json({
        message: "Order placed successfully",
        order: createdOrder,
      });
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      res.status(500).json({
        message: "Placing order failed!",
      });
    });
};

exports.getOrders = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = req.query.page;
  const productQuery = Order.find();
  let fetchedOrders;
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .populate("products")
    .then((documents) => {
      fetchedOrders = documents;
      return Order.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Orders fetched successfully",
        orders: fetchedOrders,
        maxOrders: count,
      });
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Fetching orders failed!",
      });
    });
};

exports.getOrderById = (req, res, next) => {
  Order.findById(req.params.id)
    .populate("products.product")
    .then((order) => {
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching order failed!" });
    });
};

exports.updateOrder = (req, res, next) => {
  const order = new Order({
    _id: req.params.id,
    products: req.body.products,
    user: req.body.user,
    totalPrice: req.body.totalPrice,
    status: req.body.status,
  });

  Order.updateOne({ _id: req.params.id }, order)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Order updated successfully!" });
      } else {
        res.status(401).json({ message: "Not authorized or order not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Couldn't update order!" });
    });
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Order deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized or order not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting order failed!" });
    });
};
