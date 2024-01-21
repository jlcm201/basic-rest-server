const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRole, existsEMail, existsUserById } = require('../helpers/dbValidators')
const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares');
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
    check('password', 'password is required').isLength({min: 1}),
    check('eMail', eMail => `\'${eMail}\' is not valid e-mail`).isEmail(),
    check('eMail').custom(existsEMail),
    check('role').custom(isValidRole),
    validateFields
], userPost);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE'),
    check('id', id => `\'${id}\' is not valid mongoId`).isMongoId(),
    check('id').custom(existsUserById),    
    validateFields
], userDelete);

router.patch('/', userPatch);

module.exports = router;