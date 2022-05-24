"use strict";

// IMPORTS ==================================================================================================
const { Router } = require("express");
const { userController } = require("../controllers");
const authentication = require("../middleware/authentication.middleware");

const router = new Router();

// API ROUTES ===============================================================================================
router.post("/register", userController.addUser);
router.post("/login", userController.userLogin);
router.put("/update-password", userController.userUpdatePassword);

// All APIs written below needs to be authenticated with token.
router.get("/get-all", authentication, userController.getAllUsers);
router.get("/logout", authentication, userController.userLogout);
router.delete("/delete/:id", authentication, userController.deleteUser);
router.put("/update", authentication, userController.updateUser);

// EXPORTS ==================================================================================================
module.exports = router;
