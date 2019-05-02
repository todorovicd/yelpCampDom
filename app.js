const express    = require("express"),
  app            = express(),
  bodyParser     = require("body-parser"),
  mongoose       = require("mongoose"),
  Campground     = require("./models/campground"),
  seedDB         = require("./seeds"),
  Comment        = require("./models/comment"),
  passport       = require("passport"),
  LocalStrategy  = require("passport-local"),
  User           = require("./models/user"),
  methodOverride = require("method-override");

//requiring routes
const commentRoutes = require("./routes/comments"),
  campgroundRoutes  = require("./routes/campgrounds"),
  indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//seed the database
// seedDB();

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

//add prefixes to routes. So you don't type them up for every route
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () => {
  console.log("Yelp Camp Server Has Started!");
});
