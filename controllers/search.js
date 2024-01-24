const { request, response } = require("express");
const { User, Category, Product } = require('../models');
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    let users;
    if (isMongoId) {
        users = await User.findById(term).exec();
    } 
    else {
        const regExp = new RegExp(term, 'i');
        users = await User.find({
            $or: [
                { name: regExp },
                { eMail: regExp }
            ],
            $and: [{ state: true}]
        }).exec();
    }
    
    return res.status(200).json({ results: users ? [ users ] : [] });
};

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    let categories;
    if (isMongoId) {
        categories = await Category.findById(term).exec();
    } 
    else {
        const regExp = new RegExp(term, 'i');
        categories = await Category.find({ name: regExp, state: true }).exec();
    }
    
    return res.status(200).json({ results: categories ? [ categories ] : [] });
};

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    let products;
    if (isMongoId) {
        products = await Product.findById(term).populate('category', 'name').exec();
    } 
    else {
        const regExp = new RegExp(term, 'i');
        products = await Product.find({ 
            $or: [{name: regExp}, {description: regExp}], 
            $and: [{state: true }]
        }).populate('category', 'name').exec();
    }
    
    return res.status(200).json({ results: products ? [ products ] : [] });
};

const search = (req = request, res = response) => {

    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) return res.status(400).json({
        msg: `allowe collections: ${allowedCollections}`
    });

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'search under construction'
            });
            break;
    }
};

module.exports = { search };
