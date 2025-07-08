require('dotenv').config();
const crypto = require('crypto');
const secretKey = process.env.SECRET_KEY;
console.log("secretKey", secretKey) // Must be 32 bytes for AES-256
const algorithm = 'aes-256-ecb'; // Using AES-256-ECB (No IV required)

// Encryption Function
const encodeToken = (token) => {
    const stringifiedData = JSON.stringify(token);
    const key = crypto.createHash('sha256').update(secretKey).digest(); // 32-byte key

    const cipher = crypto.createCipheriv(algorithm, key, null); // No IV is used here
    let encrypted = cipher.update(stringifiedData, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Only token is returned, no IV required
    const result = {
        token: encrypted,
    };
    console.log(result)
    return result;
};

module.exports = { encodeToken };
