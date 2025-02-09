const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment= require("../models/Comment");
const User = require("../models/User");
const moment = require('moment');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId); // Get the user by their ID
      const posts = await Post.find({ user: user._id }); // Get the posts of that user
      res.render("profile.ejs", {
        user: user,
        posts: posts,
        loggedInUser: req.user,
        showLikedPosts: false // Add this variable to distinguish between posts and liked posts
      });
    } catch (err) {
      console.log(err);
      res.redirect("/"); // If there's an error, redirect to the homepage
    }
  },
  
  getAdd: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("add.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getEdit: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("edit.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate('user', 'profileImage userName') // Populate user field with specific data
        ;
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
      res.redirect('/');
    }
  },  
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('user', 'userName').exec();
      const comments = await Comment.find({post: req.params.id}).populate('user', 'userName profileImage').sort({ createdAt: "desc" }).lean();
      // Fetch the user who created the post
      const postUser = await User.findById(post.user);
      res.render("post.ejs", { post: post, loggedInUser: req.user, comments: comments, postUser: postUser, moment: moment });
    } catch (err) {
      console.log(err);
      res.redirect('/')
    }
  },
  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
  
      const postData = {
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        saves: 0,
        user: req.user.id,
      };
  
      // Add conditional fields
      if (req.body.title === 'Recipe') {
        postData.protein = req.body.protein;
        postData.calories = req.body.calories;
      } else if (req.body.title === 'Exercise') {
        postData.caloriesBurned = req.body.caloriesBurned;
      }
  
      await Post.create(postData);
      console.log("Post has been added!");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      // Ensure the post exists
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      const userId = req.user.id;  // Make sure req.user.id is populated correctly
  
      // Check if the user has already liked the post
      const isLiked = post.likedBy.includes(userId);
  
      if (isLiked) {
        // User has already liked, so we will "unlike" (remove the like)
        post.likes--;  // Decrease the like count
        post.likedBy = post.likedBy.filter(id => id.toString() !== userId);  // Remove the user ID from likedBy
        console.log(`Unlike action: Likes decreased to ${post.likes}`);
      } else {
        // User hasn't liked the post yet, so we will "like" (add the like)
        post.likes++;  // Increase the like count
        post.likedBy.push(userId);  // Add the user ID to likedBy
        console.log(`Like action: Likes increased to ${post.likes}`);
      }
  
      // Like the updated post document
      await post.save();
  
      // Redirect to the post page to reflect the updated state
      res.redirect(`/post/${post.id}`);
    } catch (err) {
      console.log("Error during like/unlike action:", err);
      res.status(500).send("Server error");
    }
  },  
    
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      res.redirect(`/profile/${req.user.id}`);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      user.bio = req.body.bio;
  
      if (req.file) {
        // Delete old profile image from Cloudinary if it exists
        if (user.profileImage) {
          await cloudinary.uploader.destroy(user.cloudinaryId);
        }
        
        // Upload new image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        user.profileImage = result.secure_url;
        user.cloudinaryId = result.public_id;
      }
  
      await user.save();
      console.log("Profile updated successfully");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
      res.redirect("/edit");
    }
  },


  getExplore: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate('user', 'profileImage userName') // Populate user field with specific data
        ;
      res.render("explore.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
      res.redirect('/');
    }
  }, 

  savePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      // Ensure the post exists
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      const userId = req.user.id;  // Make sure req.user.id is populated correctly
  
      // Check if the user has already liked the post
      const isSaved = post.savedBy.includes(userId);
  
      if (isSaved) {
        // User has already saved, so we will "unsave" (remove the save)
        post.saves--;  // Decrease the save count
        post.savedBy = post.savedBy.filter(id => id.toString() !== userId);
        console.log(`Unsave action: Saves decreased to ${post.saves}`);
      } else {
        // User hasn't saved the post yet, so we will "save" (add the save)
        post.saves++;  // Increase the save count
        post.savedBy.push(userId);  // Add the user ID to savedBy
        console.log(`Save action: Saves increased to ${post.saves}`);
      }
  
      // Save the updated post document
      await post.save();
  
      // Redirect to the post page to reflect the updated state
      res.redirect(`/post/${post.id}`);
    } catch (err) {
      console.log("Error during save/unsave action:", err);
      res.status(500).send("Server error");
    }
  },

  getSavedPosts: async (req, res) => {
    try {
      const savedPosts = await Post.find({ savedBy: req.user.id }).populate("user"); // Fetch posts saved by the user
      res.render("savedPosts", { posts: savedPosts, user: req.user });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
  getLikedPosts: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId); // Get the user whose profile is being viewed
      const likedPosts = await Post.find({ likedBy: req.params.userId }).populate("user"); // Fetch posts liked by the user
      res.render("profile.ejs", {
        user: user,
        posts: likedPosts,
        loggedInUser: req.user,
        showLikedPosts: true, // Pass context to differentiate
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },  
  
};
