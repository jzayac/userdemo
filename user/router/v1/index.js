const express = require("express");
const router = express.Router();
const userService = require("../../services/user/user");

router.post("/user/login", userService.login);

router.get("/user/logout", userService.logout);

// router.get("/me", userService.info);

module.exports = router;
