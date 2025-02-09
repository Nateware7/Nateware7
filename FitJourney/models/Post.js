const mongoose = require("mongoose");
const { formatDistanceToNow } = require('date-fns');
const { enUS } = require('date-fns/locale');

const customLocale = {
  ...enUS,
  formatDistance: (token, count, options) => {
    const defaultFormat = enUS.formatDistance(token, count, options);
    return defaultFormat.replace(/^about /, ''); // Remove "about"
  },
};

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  comments: {
    type: Number,
    default: 0, // Default to 0 when the post is created
  },

  saves: {
    type: Number,
    default: 0,
  },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => formatDistanceToNow(new Date(timestamp), { addSuffix: true , locale: customLocale}),
  },
  protein: {
    type: Number,
  },
  calories: {
    type: Number,
  },
  caloriesBurned: {
    type: Number,
  },

});

module.exports = mongoose.model("Post", PostSchema);
