const express  = require("express"),
    router     = express.Router(), 
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    async      = require("async"),
    nodemailer = require("nodemailer"),
    crypto     = require("crypto");


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
  
// //forgot route
// router.get("/forgot", (req, res) => {
//   res.render("forgot");
// });

// router.post("/forgot", (req, res, next) => {
//   async.waterfall([
//     (done) => {
//       crypto.randomBytes(20, (err, buf) => {
//         var token = buf.toString("hex");
//         done(err, token);
//       });
//     },
//     (token, done) => {
//       User.findOne({ email: req.body.email }, (err, user) => {
//         if(!user) {
//           req.flash("error", "No account with that email address exists.");
//           return res.redirect("/forgot");
//         }
//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         user.save((err) => {
//           done(err, token, user);
//         });
//       });
//     },
//     (token, user, done) => {
//       var smtpTransport = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           user: "yelpcampdom@gmail.com",
//           pass: process.env.GMAILPW
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: "yelpcampdom@gmail.com",
//         subject: "Node.js Password Reset",
//         text: `You are receiving this because you (or someone else) have requested the reset of the password.
//         Please click on the following link, or paste this into your browser to complete the process."
//         http://${req.headers.host}/reset/${token}
//         If you did not request this, please ignore this email and your password will remain unchanged. `
//       };
//       smtpTransport.sendMail(mailOptions, (err) => {
//         console.log("mail sent");
//         req.flash("success", `An email has been sent to ${user.email} with further instructions.`);
//         done(err, "done");
//       });
//     }
//   ],
//   (err) => {
//     if(err) return next(err);
//     res.redirect("/forgot");
//   });
// }); 


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