var express = require("express");
var router  = express.Router();
var Brewery = require("../models/brewery");
var middleware = require("../middleware");


//INDEX - show all breweries
router.get("/", function(req, res){
    // Get all breweries from DB
    Brewery.find({}, function(err, allBreweries){
       if(err){
           console.log(err);
       } else {
          res.render("breweries/index",{breweries:allBreweries});
       }
    });
});

//CREATE - add new brewery to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to brewery array
    var name = req.body.name;
    var brewery_type = req.body.brewery_type;
    var street = req.body.street;
    var city = req.body.city;
    var state = req.body.state;
    var postal_code = req.body.postal_code;
    var country = req.body.country;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var phone = req.body.phone;
    var website_url = req.body.website_url;
    var updated_at = req.body.updated_at;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBrewery = {name: name, brewery_type: brewery_type, street: street, city: city, state: state, postal_code: postal_code, country: country, longitude: longitude, latitude: latitude, phone: phone, website_url: website_url, updated_at: updated_at, image: image, description: desc, author:author}
    // Create a new Brewery and save to DB
    Brewery.create(newBrewery, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Breweries page
            console.log(newlyCreated);
            res.redirect("/breweries");
        }
    });
});

//NEW - show form to create new Brewery
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("breweries/new"); 
});

// SHOW - shows more info about one Brewery
router.get("/:id", function(req, res){
    //find the brewery with provided ID
    Brewery.findById(req.params.id).populate("comments").exec(function(err, foundBrewery){
        if(err){
            console.log(err);
        } else {
            console.log(foundBrewery)
            //render show template with that Brewery
            res.render("breweries/show", {brewery: foundBrewery});
        }
    });
});

// EDIT BREWERY ROUTE
router.get("/:id/edit", middleware.checkBreweryOwnership, function(req, res){
    Brewery.findById(req.params.id, function(err, foundBrewery){
        res.render("breweries/edit", {Brewery: foundBrewery});
    });
});

// UPDATE Brewery ROUTE
router.put("/:id",middleware.checkBreweryOwnership, function(req, res){
    // find and update the correct brewery
    Brewery.findByIdAndUpdate(req.params.id, req.body.Brewery, function(err, updatedBrewery){
       if(err){
           res.redirect("/breweries");
       } else {
           //redirect somewhere(show page)
           res.redirect("/breweries/" + req.params.id);
       }
    });
});

// DESTROY Brewery ROUTE
router.delete("/:id",middleware.checkBreweryOwnership, function(req, res){
   Brewery.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/breweries");
      } else {
          res.redirect("/breweries");
      }
   });
});


module.exports = router;

