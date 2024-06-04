module.exports = (err, req, res, next) => {
    if(err.name == "MongoServerError"){
        res.status(409).json({
            success: false,
            message: "Duplicate email",
            err,
            stack: err.stack,
            statusCode: err.statusCode
        })
        return
    }

    res.status(400).json({
        success: false,
        message: err.message,
        err,
        stack: err.stack,
        statusCode: err.statusCode
    })
}
