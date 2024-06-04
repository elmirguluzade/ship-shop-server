const Product = require('../model/product');
const User = require('../model/user')
const mongoose = require('mongoose')
require("dotenv").config({ path: "./config.env" });

const connectionString = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
(async () => {
    try {
        mongoose.connect(connectionString);
        console.log("MongoDB connected");
        if (process.argv[2] == "delete") {
            await Product.deleteMany({})
            console.log('DB is empty now');
        }
        process.exit()
    } catch (err) {
        console.log(err);
    }
})()
