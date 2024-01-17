const { request, response } = require('express');

const userGet = (req = request, res = response) => {
    const params = {...req.query};

    const { name, apiKey, vDefault } = params;
    res.json({
        name, 
        apiKey,
        vDefault: vDefault === '',
        msg: 'Get API - Controller'
    });
};

const userPost = (req = request, res = response) => {
    const body = req.body;
    res.json({
        ...body,
        msg: 'Post API - Controller'
    });
};

const userPut = (req = request, res = response) => {
    const id = req.params.id;
    res.json({
        msg: 'Put API - Controller',
        id
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: 'Delete API - Controller'
    });
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