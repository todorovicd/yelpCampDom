const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Schema Setup
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
  {
    name: "Granite Hill",
    image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg",
    description:
      "This is a Granite Hill camground. No water, no bathrooms. Beautiful granite!"
  },
  (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Newly created campground: ");
      console.log(campground);
    }
  }
);

var campgrounds = [
  {
    name: "Salmon Creek",
    image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"
  },
  {
    name: "Granite Hill",
    image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"
  },
  {
    name: "Salmon Creek",
    image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"
  },
  {
    name: "Granite Hill",
    image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"
  },
  {
    name: "Salmon Creek",
    image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"
  },
  {
    name: "Granite Hill",
    image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"
  }
];

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
      res.render("index", { campgrounds: allCampgrounds });
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
  res.render("new");
});

//SHOW - shows info about a sigle camground
app.get("/campgrounds/:id", (req, res) => {
  //find campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(3000, () => {
  console.log("Yelp Camp Server Has Started!");
});
