const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { existsEMail } = require('../helpers/dbValidators');

const router = Router();

router.post('/login', [
    check('password', 'password is required').not().isEmpty(),
    check('eMail', eMail => `\'e${eMail}\' is not valid e-mail`).isEmail(),
    check('eMail').not().custom(existsEMail),
    validateFields
], login);

module.exports = router;

