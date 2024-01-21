const User = require('../models/user');
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('xToken');

    if (!token) return res.status(401).json({
        msg: 'we need a token.'
    });

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const authUser = await User.findById(uid).exec();

        // user valid
        if (!authUser || authUser.state === false)  res.status(401).json({
            msg: 'invalid token.'
        });
        
        req.authUser = authUser;
        
        next();
    } catch (error) {
        console.log(`Validate JWT Error: ${error}`);
        res.status(401).json({
            msg: 'invalid token.'
        });
    }

};

module.exports = { validateJWT };