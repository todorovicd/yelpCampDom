const mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment")

var data = [
    {
        name: "Damjan Campp 1",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        description: "dasdasdasd asd asdasd asdasdasdas dasdad as. asdasdasdasdasda asdasd asd asdasdasdasd adsasdasdasd asdasdasd asdadad adsdsdasdafr asgad ggadg sdsdasdafr asgad ggadsdsdasdafr asgad ggad asg asgas gasg asgd."
    },
    {
        name: "Damjan Campp 2",
        image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
        description: "dasdasdasd asd asdasd asdasdasdas dasdad as. asdasdasdasdasda asdasd asd asdasdasdasd adsasdasdasd asdasdasd asdadad adsdsdasdafr asgad ggadg sdsdasdafr asgad ggadsdsdasdafr asgad ggad asg asgas gasg asgd."
    },
    {
        name: "Damjan Campp 3",
        image: "https://farm9.staticflickr.com/8041/7930201874_6c17ed670a.jpg",
        description: "dasdasdasd asd asdasd asdasdasdas dasdad as. asdasdasdasdasda asdasd asd asdasdasdasd adsasdasdasd asdasdasd asdadad adsdsdasdafr asgad ggadg sdsdasdafr asgad ggadsdsdasdafr asgad ggad asg asgas gasg asgd."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("removed Campgrounds!")
        
        //add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                           text: "This place is great, but I wish there was internet.",
                           author: "Homer" 
                        }, (err, comment) => {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!")
                            }
                        }
                    )
                }
            });
        });
    });

    //add a few comments
}

module.exports = seedDB;