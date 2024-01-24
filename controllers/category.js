const { request, response } = require("express");
const { Category } = require("../models");

// paginated - count - populate
const getCategories = async (req = request, res = response) => {
    let { limit, page } = req.query;
    if (isNaN(limit)) limit = 5;
    if (isNaN(page)) page = 0;

    const query = { state: true };
    const [count, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query).populate('user', 'name').skip(page * limit).limit(limit)
    ]); 

    res.status(200).json({count, categories});
};

// get Category - populate
const getCategory = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const query = { state: true };
        const category = await Category.findById(id).populate('user', 'name').find(query).exec();

        if (!category) return res.status(400).json({
            msg: 'Category does not exists'
        });

        res.status(200).json(category);
    } catch (error) {
        console.log('getCategory:', error);
        return res.status(500).json({
            msg: 'we could not get user'
        });
    }

};

const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryExists = await Category.where({name}).findOne();
    console.log(req);

    if (categoryExists) return res.status(400).json({
        msg: `Category: \'${name}\' already exists`
    });

    // Generate data to save
    const data = {
        name,
        user: req.authUser._id
    };

    try {
        const category = new Category(data);
        await category.save();
        
        res.status(201).json(category);
    } catch (error) {
        console.log('Error CreateCategory:', error);
        return res.status(500).json({
            msg: 'error creating category'
        });
    }
};

const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, user, _id, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.authUser._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json(category);
};

// soft delete
const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    // Soft delete
    const category = await Category.findByIdAndUpdate(id, { state: false }, {new: true});

    res.status(202).json(category);
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
