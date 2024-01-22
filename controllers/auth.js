const { response, request } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { createJWT } = require("../helpers/createJWT");
const jwt = require('jsonwebtoken');
const { googleVerify } = require("../helpers/googleVerify");

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

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    const data = jwt.decode(id_token);
    console.log('data token:', data);

    try {
        const { name, img, eMail } = await googleVerify(id_token);
        console.log({ name, img, eMail });

        let user = await User.findOne({eMail}).exec();
        if (!user) {
            // Create user
            const newUser = {
                name,
                eMail,
                password: '......',
                img,
                google: true,
                role: 'USER_ROLE'
            };
            user = new User(newUser);
            user = await user.save();
        }

        // user inactive
        if (user.state === false) return res.status(401).json({
            msg: 'user blocked'
        });

        // Create JWT
        const token = await createJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'token could not be verified.'
        });
    }

    
};

module.exports = { login, googleSignIn };
