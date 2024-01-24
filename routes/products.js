const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT, hasRole } = require('../middlewares');
const { 
    createProduct, 
    getProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct } = require('../controllers/product');
const { existsProductById, existsCategoryById, existsProductBySku } = require('../helpers/dbValidators');

const router = Router();

// Get all products - public
router.get('/', getProducts);

// Get product by id - public
// validate id

router.get('/:id', [
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsProductById),
    validateFields
], getProduct);

// Create product - private - user with valid token
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('sku', 'sku is required').not().isEmpty(),
    check('category', category => `\'${category}\' is not valid mongoId`).isMongoId(),
    validateFields,
    check('category').custom(existsCategoryById),
    // check('sku').custom(existsProductBySku),
    validateFields
], createProduct);

// Update product - private - user with valid token
router.put('/:id', [
    validateJWT,
    check('category', category => `\'${category}\' is not valid mongoId`).isMongoId(),
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsProductById),
    // check('sku', 'sku is required').not().isEmpty(),
    // validateFields,
    // check('category').custom(existsCategoryById),
    // check('sku').custom(existsProductBySku),
    // check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateProduct);

// Delete product - private - admin
router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    validateFields,
    check('id').custom(existsProductById),
    validateFields
], deleteProduct);

module.exports = router;
