const { request, response } = require("express");
const { reconstructFieldPath } = require("express-validator/src/field-selection");

const isAdminRole = (req  = request, res = response, next) => {
    if (!req.authUser) return res.status(500).json({
        msg: 'First validate token'
    });

    const {role, name} = req.authUser;

    if (role !== 'ADMIN_ROLE') return res.status(401).json({
        msg: `${name} cannot perform this action`
    });

    next();
};

const hasRole = (...roles) => {
    return (req  = request, res = response, next) => {
        if (!req.authUser) return res.status(500).json({
            msg: 'First validate token'
        });

        if (!roles.includes(req.authUser.role)) return res.status(401).json({
            msg: 'User does not have required role'
        });
        console.log(roles, req.authUser.role);

        next();
    };
};


module.exports = { isAdminRole, hasRole };
