const express = require("express");
const router = express.Router();

const { signup, signin } = require("../controllers/auth");

const { signupValidator, signinValidator } = require("../validators");

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);

module.exports = router;
