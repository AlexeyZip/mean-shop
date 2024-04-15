const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.post('', (req, res, next) => {
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    });
    product.save().then((createdProduct) => {
        res.status(201).json({
            message: "Product was added successfully",
            productId: createdProduct._id
        });
    });
});

router.put("/:id", (req, res, next) => {
    const product = new Product({
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    })
    Product.updateOne({_id: req.params.id}, product).then(result => {
        res.status(200).json({message: "Update successful!"});
    })
});

router.get("/:id", (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        product ? res.status(200).json(product) : res.status(404).json({message: 'Product not found!'});
    })
});

router.get('', (req, res, next) => {
    Product.find()
        .then((documents) => {
            console.log(documents);
            res.status(200).json({
                message: 'Products fetched successfully',
                products: documents
            });
        });
});

router.delete("/:id", (req, res, next) => {
    Product.deleteOne({_id: req.params.id}).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Product deleted!"
        });
    });
});

module.exports = router;