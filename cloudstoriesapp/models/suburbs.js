const mongoose = require('mongoose');
// const config = require('../config/database');

// Schema for each story
const mainSchema = mongoose.Schema({
    geometry: {},
    latlng: [],
    properties: {},
    senti: {},
    total_tweet: Number,
    type: String
});

const NewsModel = mongoose.model('polygons_news', mainSchema);
const HealthModel = mongoose.model('health_data', mainSchema);
const ShowsModel = mongoose.model('polygons_shows', mainSchema);
const MiscModel = mongoose.model('polygons_rawtweets2', mainSchema);

module.exports.getNewsData = function (callback) {
    NewsModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .exec(callback);
}

module.exports.getHealthData = function (callback) {
    HealthModel
    .find({})
    .sort({total_tweet: -1})
    .exec(callback);
}

module.exports.getShowsData = function (callback) {
    NewsModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .exec(callback);
}

module.exports.getMiscData = function (callback) {
    MiscModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .limit(250)
    .exec(callback);
}