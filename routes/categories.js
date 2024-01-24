const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT, hasRole } = require('../middlewares');
const { 
    createCategory, 
    getCategories, 
    getCategory, 
    updateCategory, 
    deleteCategory } = require('../controllers/category');
const { existsCategoryById } = require('../helpers/dbValidators');

const router = Router();

// Get all categories - public
router.get('/', getCategories);

// Get category by id - public
// validate id

router.get('/:id', [
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
], getCategory);

// Create category - private - user with valid token
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
], createCategory);

// Update category - private - user with valid token
router.put('/:id', [
    validateJWT,
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsCategoryById),
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateCategory);

// Delete category - private - admin
router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
], deleteCategory);

module.exports = router;