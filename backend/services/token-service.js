const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: "1h",
        });
        const accessToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: "1y",
        });
    }
}

module.exports = new TokenService();
