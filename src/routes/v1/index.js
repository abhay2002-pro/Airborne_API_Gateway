const express = require("express");

const { InfoController } = require("../../controllers");
const userRoutes = require("./user-routes")

const { AuthMiddlewares } = require("../../middlewares")

const router = express.Router();

router.get("/info", AuthMiddlewares.checkAuth, InfoController.info);

router.use("/user", userRoutes)

module.exports = router;
