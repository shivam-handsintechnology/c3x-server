const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const secretKey = "98684707692312139868470769231213"
const iv = "9868470769231213"
const algorithm = 'aes-256-cbc';
// Function to encrypt a password
exports.encryptPassword = async (password) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');
    return `${iv.toString('hex')}:${encryptedPassword}`;
}

// Function to decrypt a password
exports.decryptPassword = (encryptedPassword) => {
    const [ivHex, encryptedData] = encryptedPassword.split(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decryptedPassword = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
}

// Example usage
exports.hashPassword = async (password) => {
    try {
        const data = await this.encryptPassword(password);
        return data;
    } catch (error) {
        console.error({ error });
        throw error; // You can choose to handle or re-throw the error here
    }
};

exports.usersWithHashedPasswordsPromiseArray = async (users) => {
    return users.map(async (user) => {
        try {
            const hashedPassword = await this.encryptPassword(user.password);
            return {
                ...user,
                password: hashedPassword,
                AccountNo: uuidv4(),
            };
        } catch (error) {
            console.error({ error });
            throw error; // You can choose to handle or re-throw the error here
        }
    });
};
