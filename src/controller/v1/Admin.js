
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");
const message = require("../../utils/constant")
const adminModel = require("../../models/admin");

const adminLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        console.log("login .......................");
        const { email, password, } = req.body;
        console.log(req.body)
        let admin = await adminModel.findOne({
            email
        });
        console.log("admindetails", admin);
        if (!admin) {
            return res.status(400).json({
                message: message.ADMIN_NOT_EXITS
            });
        }
        if (email == admin.email && password == admin.password) {
            const access = {
                admin: {
                    id: admin._id,
                }
            };
            console.log("accccv", access);

            let token = jwt.sign(access, "config.secret", {
                expiresIn: 86400 // expires in 24 hours
            });
            console.log("token", token);

            return res.json({ message: message.LOGIN_SUCCESS, token: token });

        } else {
            return res.status(400).json({
                message: message.PASSWORD
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: message.LOGIN_ERROR_MESSAGE });
    }
};

module.exports = { adminLogin }