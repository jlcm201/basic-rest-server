const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    sku: { type: String, required: [ true, 'sku is required' ], unique: true },
    name: { type: String, required: [ true, 'Category name is required' ], unique: true },
    state: { type: Boolean, default: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    available: { type: Boolean, default: true }
});

ProductSchema.methods.toJSON = function() {
    const { __v, state, _id, ...product } = this.toObject();
    product.id = _id;
    return product;
};

module.exports = model('Product', ProductSchema);