const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const productsDB = () => {
    const adapter = new FileSync('./models/products.json');
    return low(adapter);
}

const skillsDB = () => {
    const adapter = new FileSync('./models/skills.json');
    return low(adapter);
}

const adminDB = () => {
    const adapter = new FileSync('./models/db.json');
    return low(adapter);
}

const emailDB = () => {
    const adapter = new FileSync('./models/email.json');
    return low(adapter);
}

module.exports = {
    productsDB,
    skillsDB,
    adminDB,
    emailDB
};