const {
    check,
    validationResult
} = require("express-validator");

exports.signupValidator = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid Email is required").isEmail(),
    check("password", "Password must be atlest 6 characters").isLength({
        min: 6
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors
                .array()
                .map((error) => error.msg)
                .join(" | ");
            return res.status(422).json({
                error
            });
        }
        next();
    },
];

exports.signinValidator = [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors
                .array()
                .map((error) => error.msg)
                .join(" | ");
            return res.status(422).json({
                error
            });
        }
        next();
    },
];

exports.createCategoryValidator = [
    check("name", "Name is required").notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors
                .array()
                .map((error) => error.msg)
                .join(" | ");
            return res.status(422).json({
                error
            });
        }
        next();
    },
];