const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { isValidRole, existsEMail, existsUserById } = require('../helpers/dbValidators')
const { 
    userGet, 
    userPost, 
    userPut, 
    userDelete, 
    userPatch
} = require('../controllers/user');
const router = Router();

router.get('/', userGet);

router.put('/:id', [
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsUserById),
    check('role').custom(isValidRole),
    validateFields
], userPut);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'The password must be at least 6 characters').isLength({min: 6}),
    check('eMail', 'Invalid eMail').isEmail(),
    check('eMail').custom(existsEMail),
    check('role').custom(isValidRole),
    validateFields
], userPost);

router.delete('/:id', [
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userDelete);

router.patch('/', userPatch);

module.exports = router;