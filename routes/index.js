const express  = require("express"),
    router     = express.Router(), 
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground")

//root route
router.get("/", (req, res) => {
    res.render("landing");
  });
  
  //show register form
  router.get("/register", (req, res) => {
    res.render("register", { page: "register" });
  });
  
 //handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User(
    {
      username: req.body.username, 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.avatar 
    });
  if(req.body.adminCode === "secretcode123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, function(){
         req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
         res.redirect("/campgrounds"); 
      });
  });
});
  
  //show login form
  router.get("/login", (req, res) => {
    res.render("login", { page: "login"});
  });
  
  //handle login logic
  //router.post("/login", middleware, callback)
  router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
  })
  
  //logout route
  router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
  });
  
//USER PROFILE ROUTE
  router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) => {
        if(err) {
          req.flash("error", "Something went wrong.");
          req.redirect("/");
        }
        res.render("users/show", { user: foundUser, campgrounds: campgrounds });
      });
    });
  });

  module.exports = router;