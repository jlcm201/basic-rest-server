const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: { type: String, required: [ true, 'Category name is required' ], unique: true },
    state: { type: Boolean, default: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

CategorySchema.methods.toJSON = function() {
    const { __v, state, _id, ...category } = this.toObject();
    category.id = _id;
    return category;
};

module.exports = model('Category', CategorySchema);
