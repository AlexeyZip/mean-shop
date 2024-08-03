const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
