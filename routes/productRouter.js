const router = require('express').Router()
const productController = require('../controllers/productController')
const { top4Price, top4Time } = require('../middlewares/top4')

router.get('/', productController.allProducts)
router.get('/top4price', top4Price, productController.allProducts)
router.get('/top4time', top4Time, productController.allProducts)
router.get('/category', productController.categories)
router.get('/:id', productController.oneProduct)
router.post('/addReview', productController.addReview)
module.exports = router
