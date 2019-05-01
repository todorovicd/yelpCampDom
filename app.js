const express    = require("express"),
  app            = express(),
  bodyParser     = require("body-parser"),
  mongoose       = require("mongoose"),
  Campground     = require("./models/campground"),
  seedDB         = require("./seeds"),
  Comment        = require("./models/comment"),
  passport       = require("passport"),
  LocalStrategy  = require("passport-local"),
  User           = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Meaty is the best dog in the world!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };

  //Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - shows info about a sigle camground
app.get("/campgrounds/:id", (req, res) => {
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


//=========================================
//            COMMENTS ROUTE
//=========================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", { campground: campground });
    }
  })
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      //create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        }
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id)
        }
      });
    }
  });
});

//=======================================================
//                AUTH ROUTES
//=======================================================

//show register form
app.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
app.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

//show login form
app.get("/login", (req, res) => {
  res.render("login");
});

//handle login logic
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", 
{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {
})

//logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
  console.log("Yelp Camp Server Has Started!");
});
