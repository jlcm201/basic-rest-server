const { Role, User, Category, Product } = require('../models');

const isValidRole = async(role = '') => {
    const roleExists = await Role.where({ role }).findOne();
    if (!roleExists) throw new Error(`Role: \'${role}\' in not registered in DB`);
}

const existsEMail = async (eMail = '') => {
    // Validate if the email exists
    const eMailExists = await User.where({eMail}).findOne();
    if (eMailExists) throw new Error(`EMail: \'${eMail}\' already exists`);
};

const existsUserById = async (id = '') => {
    // Validate if the email exists
    const idExists = await User.findById(id).exec();
    if (!idExists) throw new Error(`id: \'${id}\' does not exist`);
};

const existsCategoryById = async (id = '') => {
    // Validate if the email exists
    const idExists = await Category.findById(id).exec();
    if (!idExists) throw new Error(`id: \'${id}\' does not exist`);
};

const existsProductById = async (id = '') => {
    // Validate if the email exists
    const idExists = await Product.findById(id).exec();
    if (!idExists) throw new Error(`id: \'${id}\' does not exist`);
};

const existsProductBySku = async (sku = '') => {
    // Validate if the email exists
    const skuExists = await Product.findOne({sku}).exec();
    if (skuExists) throw new Error(`sku: \'${sku}\' already exists`);
};

module.exports = { isValidRole, existsEMail, existsUserById, existsCategoryById, existsProductById, existsProductBySku };
