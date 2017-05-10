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

const indexSchema = mongoose.Schema({
    type: String,
    properties: {},
    id: String
});

const NewsModel = mongoose.model('polygons_news', mainSchema);
const HealthModel = mongoose.model('health_datas', mainSchema);
const ShowsModel = mongoose.model('polygons_shows', mainSchema);
const MiscModel = mongoose.model('polygons_rawtweets2', mainSchema);
const ProspModel = mongoose.model('prosp_indices', indexSchema);
const ObesityModel = mongoose.model('obese_indices', indexSchema);
const VulnerModel = mongoose.model('vulner_indices', indexSchema);

module.exports.getNewsData = function (callback) {
    NewsModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .limit(100)
    .exec(callback);
}

module.exports.getHealthData = function (callback) {
    HealthModel
    .find({})
    .sort({total_tweet: -1})
    .limit(100)
    .exec(callback);
}

module.exports.getShowsData = function (callback) {
    NewsModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .limit(100)
    .exec(callback);
}

module.exports.getMiscData = function (callback) {
    MiscModel
    .find({}, { "_id": 0 })
    .sort({total_tweet: -1})
    .limit(100)
    .exec(callback);
}

module.exports.getProspData = function (callback) {
    ProspModel
    .find({}, { "_id": 0, "properties": 1 })
    .exec(callback);
}

module.exports.getObeseData = function (callback) {
    ObesityModel
    .find({}, { "_id": 0, "properties": 1 })
    .exec(callback);
}

module.exports.getVulnerData = function (callback) {
    VulnerModel
    .find({}, { "_id": 0, "properties": 1 })
    .exec(callback);
}
