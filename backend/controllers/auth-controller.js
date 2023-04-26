const otpservice = require("../services/otp-services");
const hashService = require("../services/hash-service");
const UserService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDro = require("../dtos/user-dto");
class AuthController {
    async sendOtp(req, res, next) {
        const { phone } = req.body;

        if (!phone) {
            res.status(400).json({ message: "Phone field is required!" });
        }

        const otp = await otpservice.generateOtp();

        // Hash
        const ttl = 1000 * 60 * 2; // 2 min
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        try {
            //await otpservice.sendBySms(phone, otp);
            return res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "message sending failed" });
        }

        res.status(200).json({
            hash: hash,
            Otp: otp,
            phone: phone,
        });
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;

        if (!otp || !hash || !phone) {
            res.status().json({ message: "All fields are required!" });
        }

        const [hashedOtp, expires] = hash.split(".");

        if (Date.now() > +expires) {
            res.status(400).json({ massage: "OTP expired!" });
        }

        const data = `${phone}.${otp}.${expires}`;
        const IsValid = otpservice.verifyOtp(hashedOtp, data);

        if (!IsValid) {
            res.status(400).json({ message: "Invalid Otp" });
        }

        // Create new User by Phone number
        let user;
        //let accessToken;

        try {
            user = await UserService.findUser({ phone: phone });
            if (!user) {
                user = await UserService.createUser({ phone: phone });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "DB error" });
        }

        // JWT Token
        const { accessToken, refreshToken } = tokenService.generateToken({
            _id: user._id,
            activated: false,
        });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httponly: true,
        });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httponly: true,
        });

        const userDto = new UserDro(user);
        res.json({ user: userDto, auth: true });
    }

    async refresh(req, res) {
        //get refresh Token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        // check if token is in db
        try {
            const token = tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );

            if (!token) {
                return res.status(401).json({ message: "Invalid Token" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal error" });
        }

        //check if valid user
        const user = UserService.findUser({ _id: userData._id });

        if (!user) {
            return res.status(404).json({ message: "No User" });
        }

        // Generate new token
        const { refreshToken, accessToken } = tokenService.generateToken({
            _id: userData._id,
        });

        // Update refresh Token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (error) {
            return res.status(500).json({ message: "Internal error" });
        }

        //put in cookie
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httponly: true,
        });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httponly: true,
        });
        //response
        const userDto = new UserDro(user);
        res.json({ user: userDto, auth: true });
    }

    async logout(req, res) {
        // delete refresh token for db
        const { refreshToken } = req.cookies;
        try {
            await tokenService.deleteToken(refreshToken);
            res.clearCookie("refreshToken");
            res.status(200).json({ user: null, auth: false });
        } catch (error) {
            return res.status(500).json({ message: "Internal error" });
        }
    }
}

module.exports = new AuthController();
