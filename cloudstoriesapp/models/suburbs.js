const mongoose = require('mongoose');
const config = require('../config/database');

// Story Schema
// for now these were on the top of my head
// we'll update our schema after a group meeting
const polygonSchema = mongoose.Schema({    
    tweet_sentiment: String,
    value: {
        text: String,
        co: {
            coordinates: Array,
            type: String
        }
    }
});

const Polygon = module.exports.Polygon = mongoose.model('news_pros', polygonSchema);

// module.exports.getStoryById = function(id, callback) {
//     Polygon.findbyId(id, callback);
// };

// module.exports.getStoryByTitle = function(title, callback) {
//     const query = {title: title};
//     Polygon.findOne(query, callback);
// };