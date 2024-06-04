const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('../errors/ErrorHandler')
const userRouter = require('../routes/userRouter');
const productRouter = require('../routes/productRouter');

app.use(cors({credentials: true, origin: "https://shipshops.vercel.app"}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/user', userRouter)
app.use('/product', productRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `${req.originalUrl} doesn't exist`
    })
})

// Global Error Handler
app.use(errorHandler)

const connectionString = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
(() => {
    mongoose.connect(connectionString);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server is listenin at ${PORT}`));
})()
