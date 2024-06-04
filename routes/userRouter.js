const router = require('express').Router()
const authController = require('../controllers/authController')

router.get('/verify', authController.verify)
router.post('/logout', authController.logout)
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forget', authController.resetPassword)
router.post('/update', authController.updatePassword)
router.post('/updateInfo', authController.updateInfo)
router.patch('/reset/:resetToken', authController.changePassword)


module.exports = router
