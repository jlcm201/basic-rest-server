const { response, request } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { createJWT } = require("../helpers/createJWT");

const login = async (req = request, res = response) => {

    const { eMail, password } = req.body;

    try {
        // Validate if email exists
        const user = await User.where({eMail}).findOne();
        console.log('user:', user);

        if (!user) return res.status(400).json({
            msg: 'user/password are not correct - eMail'
        });

        // Validate if user is active
        if (user.state === false) return res.status(400).json({
            msg: 'user/password are not correct - state'
        });
        // Validate password

        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) return res.status(400).json({
            msg: 'user/password are not correct - password'
        });

        // Generate JWT
        const token = await createJWT(user.id);
        
        const result = {
            msg: 'Logged', user, token
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        const result = { msg: 'Error: contact administrator.' }

        res.status(500).json(result);
    }

    
};

module.exports = { login };
