//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();
const port = 3000;
// const posts = [];

const mongoDB = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
// console.log(process.env);

// Setup MongoDB driver
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoDB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Sample data for the pages
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create database schema

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, function (err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,

        posts: posts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    startingContent: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    startingContent: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose", {});
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

post.save(function (err) {
  if (!err) {
    res.redirect("/");
  } else {
    console.log(err);
  }
});

  // post.save();

  // posts.push(post);

  // res.redirect("/");
});

app.get("/posts/:postID", (req, res) => {
  // console.log(req.params.postName);
  const requestedPostName = req.params.postID;

  const newPostName = requestedPostName;

 Post.findOne({_id: newPostName}, function(err,post){
  if(err){
    console.log("No Match found " + err);
  } else {
    res.render("post", {
            newPostTitle: post.title,
            newPostBody: post.content,
    });


  }
 })


//   Post.findOne({_id: newPostName}, function (err, posts){
// posts.forEach((post) => {
//   const postIDs = post._id;
//   const newPostTitle = _.lowerCase(post.title);
//   const newPostBody = post.content;

//   console.log(requestedPostName);
//   if (postIDs === newPostName) {
//     console.log("Match found!");
//     res.render("post", {
//       newPostTitle: post.title,
//       newPostBody: newPostBody,
//     });
//   } else {
//     console.log(postIDs + " != " + newPostName);
//   }
// });

//   })



  
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server Started with database");
  });
});

// app.listen(port, function () {
//   console.log("Server started on port 3000");
// });
