const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = { isValidRole, existsEMail, existsUserById };
