const express  = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    //GET all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", { campgrounds: allCampgrounds });
      }
    });
  });
  
  //CREATE - add new campgrounds to DB
  router.post("/", isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author };
  
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        console.log(newlyCreated);
        res.redirect("/campgrounds");
      }
    });
  });
  
  //NEW - show form to create new campground
  router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
  });
  
  //SHOW - shows info about a sigle camground
  router.get("/:id", (req, res) => {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
  });
  
 //middleware
 function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

  module.exports = router;