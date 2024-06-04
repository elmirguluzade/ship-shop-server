const top4Price = (req, res, next) => {
    req.query.limit = 4;
    req.query.sort = "-price"
    next()
}

const top4Time = (req, res, next) => {
    req.query.limit = 4;
    next()
}

module.exports = {top4Time, top4Price}