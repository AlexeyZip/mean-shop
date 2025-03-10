const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  status: { type: String, required: true, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  deliveryInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
});

module.exports = mongoose.model("Order", orderSchema);
