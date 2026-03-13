const express = require('express')
const router = express.Router()
const { getProducts, getCategories } = require('../controllers/productController')

router.get('/products', getProducts)
router.get('/category', getCategories)

module.exports = router