const otpservice = require("../services/otp-services");
const hashService = require("../services/hash-service");

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
            await otpservice.sendBySms(phone, otp);
            return res.json({
                hash: `${hash}.${expires}`,
                phone: phone,
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

    verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;

        if (!otp || !hash || !phone) {
            res.status().json({ message: "All fields are required!" });
        }

        const [hashedOtp, expires] = hash.split(".");

        if (Date.now() > expires) {
            res.status(400).json({ massage: "OTP expired!" });
        }

        const data = `${phone}.${otp}.${expires}`;
        const IsValid = otpservice.verifyOtp(hashedOtp, data);

        if (!IsValid) {
            res.status(400).json({ message: "Invalid Otp" });
        }

        let user;
        let accessToken;
        let refreshToken;
    }
}

module.exports = new AuthController();