const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
})

app.post('/api/products', (req, res, next) => {
    const product = req.body;
    console.log(product);
    res.status(201).json({
        message: "Product was added successfully"
    });
})

app.get('/api/products', (req, res, next) => {
    const products = [
        {
            id: '1',
            title: 'test title',
            description: 'test description'
        },
        {
            id: '2',
            title: 'test title2',
            description: 'test description2'
        }
    ]
    res.status(200).json({
        message: 'Products fetched successfully',
        products: products
    });
});

module.exports = app;