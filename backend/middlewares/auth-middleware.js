const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            throw new Error();
        }
        const userData = await tokenService.varifyAccessToken(accessToken);

        if (!userData) {
            throw new Error();
        }
        res.user = userData;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
