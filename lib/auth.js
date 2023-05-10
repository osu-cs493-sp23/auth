const jwt = require("jsonwebtoken")

const secretKey = "SuperSecret"

exports.generateAuthToken = function (userId) {
    const payload = { sub: userId }
    return jwt.sign(payload, secretKey, { expiresIn: "24h" })
}
