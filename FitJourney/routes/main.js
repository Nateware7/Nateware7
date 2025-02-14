const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const followsController = require("../controllers/follows"); // Add follows controller
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const upload = require("../middleware/multer");

// Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile/:userId", ensureAuth, postsController.getProfile); // New dynamic route
router.get("/add", ensureAuth, postsController.getAdd);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/edit", ensureAuth, postsController.getEdit);
router.get("/login", ensureGuest, authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.post("/profile", ensureAuth, upload.single("profileImage"), postsController.updateProfile);
router.get("/explore", ensureAuth, postsController.getExplore);
router.get("/savedPosts", ensureAuth, postsController.getSavedPosts);
router.get("/profile/:userId/liked", ensureAuth, postsController.getLikedPosts);

// Follow/Unfollow Routes
router.post("/follow/:id", ensureAuth, followsController.followUser); // Follow a user
router.post("/unfollow/:id", ensureAuth, followsController.followUser); // Follow a user
module.exports = router;
