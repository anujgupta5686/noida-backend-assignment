const express = require("express");
const { createUser, createLogin } = require("../controllers/createUser");
const { changeUserStatus } = require("../controllers/changeUserStatus");
const { getUserDistance } = require("../controllers/getUserDistance");
const { getUserListing } = require("../controllers/getUserListing");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/create-login", createLogin);
router.post("/change-user-status", changeUserStatus);
router.get("/get-user-distance", getUserDistance);
router.get("/get-user-listing", getUserListing);

module.exports = router;
