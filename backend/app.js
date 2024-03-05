const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const Product = require('./models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://alex:uEakyfQOi77nllbN@cluster0.aen9z5d.mongodb.net/node-angular?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed!');
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
})

app.post('/api/products', (req, res, next) => {
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
})

app.get('/api/products', (req, res, next) => {
    Product.find()
        .then((documents) => {
            console.log(documents);
            res.status(200).json({
                message: 'Products fetched successfully',
                products: documents
            });
        });
});

app.delete("/api/products/:id", (req, res, next) => {
    Product.deleteOne({_id: req.params.id}).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Product deleted!"
        });
    });
})

module.exports = app;