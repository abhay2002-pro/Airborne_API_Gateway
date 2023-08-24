const express = require('express');
const { UserController } = require("../../controllers")
const { AuthMiddlewares } = require('../../middlewares')

const router = express.Router();

router.post("/signup", AuthMiddlewares.validateAuthRequest, UserController.signup)
router.post("/signin", AuthMiddlewares.validateAuthRequest, UserController.signin)

module.exports = router;