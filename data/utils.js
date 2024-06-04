const fs = require('fs')
const path = require('path')
const Product = require('../model/product')
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const connectDB = () => {
    const connectionString = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
    (() => {
        mongoose.connect(connectionString);
        console.log("MongoDB connected");
    })()
}

const objectHandler = () => {
    fs.readFile(path.join(__dirname, 'productData.json'), 'utf-8', (err, data) => {
        if (err) throw err
        let newArr = []
        JSON.parse(data).forEach((product) => {
            let newObj = {}
            newObj.title = product.title
            newObj.price = product.price
            newObj.images = product.images
            newObj.category = product.category
            newObj.description = product.description
            newObj.rating = 0
            newObj.reviews = []
            newArr.push(newObj)
        })
        fs.writeFileSync(path.join(__dirname, 'productData.json'), JSON.stringify(newArr, null, 2), 'utf-8');
        process.exit()
    })
}

const addDataToDB = () => {
    connectDB()
    fs.readFile(path.join(__dirname, 'productData.json'), 'utf-8', async (err, data) => {
        if (err) throw err
        await Product.insertMany(JSON.parse(data))
        console.log("Successfully added");
        process.exit()
    })
}

addDataToDB()