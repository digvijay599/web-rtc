const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: "1y",
        });

        return { accessToken, refreshToken };
    }
    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({
                token,
                userId,
            });
        } catch (err) {
            console.log(err.message);
        }
    }
    async varifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }
    async varifyRefreshToken(token) {
        return jwt.verify(token, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async deleteToken(refreshToken) {
        return await refreshModel.deleteOne({
            token: refreshToken,
        });
    }
}

module.exports = new TokenService();
