const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async (req = request, res = response) => {
    let { limit, page } = req.query;
    if (isNaN(limit)) limit = 5;
    if (isNaN(page)) page = 0;

    const query = { state: true };
    const [count, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(page * limit).limit(limit)
    ]); 

    res.json({count, users});
};

const userPost = async(req = request, res = response) => {
    const { name, eMail, password, role } = req.body;
    const user = new User({ name, eMail, role });

    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Save in DB
    await user.save();
    res.json(user);
};

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...remaining } = req.body;

    // TODO: Valide versus DB

    if (password) {
        // Encrypt password
        const salt = bcryptjs.genSaltSync();
        remaining.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, remaining);

    res.json(user);
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // Hard delete
    // const user = await User.findByIdAndDelete(id);

    // Soft delete
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json(user);
};

const userPatch = (req, res = response) => {
    res.json({
        msg: 'Patch API - Controller'
    });
}

module.exports = { 
    userGet, 
    userPost, 
    userPut, 
    userDelete, 
    userPatch
};