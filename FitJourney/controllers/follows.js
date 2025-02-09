const User = require("../models/User");

module.exports = {
  followUser: async (req, res) => {
    try {
      const targetUserId = req.params.id; // The user to follow/unfollow
      const loggedInUserId = req.user.id; // The currently logged-in user

      if (targetUserId === loggedInUserId) {
        return res.status(400).send("You cannot follow yourself.");
      }

      const targetUser = await User.findById(targetUserId);
      const loggedInUser = await User.findById(loggedInUserId);

      if (!targetUser) {
        return res.status(404).send("User not found.");
      }

      // Check if already following
      const isFollowing = loggedInUser.following.includes(targetUserId);

      if (isFollowing) {
        // Unfollow the user
        loggedInUser.following = loggedInUser.following.filter(
          (id) => id.toString() !== targetUserId
        );
        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== loggedInUserId
        );
        console.log(`Unfollowed user: ${targetUserId}`);
      } else {
        // Follow the user
        loggedInUser.following.push(targetUserId);
        targetUser.followers.push(loggedInUserId);
        console.log(`Followed user: ${targetUserId}`);
      }

      await loggedInUser.save();
      await targetUser.save();

      res.redirect(`/profile/${targetUserId}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },

  getFollowers: async (req, res) => {
    try {
      const userId = req.params.id; // User whose followers to fetch
      const user = await User.findById(userId).populate("followers", "userName profileImage");

      if (!user) {
        return res.status(404).send("User not found.");
      }

      res.render("followers.ejs", { user: user, followers: user.followers });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },

  getFollowing: async (req, res) => {
    try {
      const userId = req.params.id; // User whose following list to fetch
      const user = await User.findById(userId).populate("following", "userName profileImage");

      if (!user) {
        return res.status(404).send("User not found.");
      }

      res.render("following.ejs", { user: user, following: user.following });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
};
