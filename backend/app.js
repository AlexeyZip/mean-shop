const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Product = require('./models/product');
const productsRoutes = require("./routes/products");
const app = express();


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
});

app.use('/api/products', productsRoutes);

module.exports = app;