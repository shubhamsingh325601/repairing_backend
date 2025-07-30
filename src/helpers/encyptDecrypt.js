const bcrypt = require('bcryptjs');

const encryptPassword = async(password)=>{
    const has = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, has);
    return hashedPassword;
}

const passwordCompare = async(password, existed)=>{
    return await bcrypt.compare(password, existed);
}

module.exports = {
    encryptPassword, 
    passwordCompare
};