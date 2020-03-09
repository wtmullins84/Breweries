var mongoose = require("mongoose");

var brewerySchema = new mongoose.Schema({
   name: String,
   brewery_type: String,
   street: String,
   city: String,
   state: String,
   postal_code: String,
   country: String,
   longitude: String,
   latitude: String,
   phone: String,
   website_url: String,
   updated_at: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Brewery", brewerySchema);
