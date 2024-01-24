const { request, response } = require("express");
const { Product } = require("../models");

// paginated - count - populate
const getProducts = async (req = request, res = response) => {
    let { limit, page } = req.query;
    if (isNaN(limit)) limit = 5;
    if (isNaN(page)) page = 0;

    const query = { state: true };
    const [count, categories] = await Promise.all([
        Product.countDocuments(query),
        Product
            .find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(page * limit)
            .limit(limit)
    ]); 

    res.status(200).json({count, categories});
};

// get Product - populate
const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const query = { state: true };
        const product = await Product
            .findById(id)
            .populate('user', 'name')
            .populate('category', 'name')
            .find(query)
            .exec();

        if (!product) return res.status(400).json({
            msg: 'Product does not exists'
        });

        res.status(200).json(product);
    } catch (error) {
        console.log('getProduct:', error);
        return res.status(500).json({
            msg: 'we could not get user'
        });
    }

};

const createProduct = async (req = request, res = response) => {
    const { sku, category, description } = req.body;
    const name = req.body.name.toUpperCase();

    // Generate data to save
    const data = {
        sku,
        name,
        user: req.authUser._id,
        category,
        description
    };

    try {
        const product = new Product(data);
        await product.save();
        
        res.status(201).json(product);
    } catch (error) {
        console.log('Error CreateProduct:', error);
        return res.status(500).json({
            msg: 'error creating product'
        });
    }
};

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, user, _id, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.authUser._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json(product);
};

// soft delete
const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    // Soft delete
    const product = await Product.findByIdAndUpdate(id, { state: false }, {new: true});

    res.status(202).json(product);
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
