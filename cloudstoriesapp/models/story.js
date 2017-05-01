const mongoose = require('mongoose');
const config = require('../config/database');

// Story Schema
// for now these were on the top of my head
// we'll update our schema after a group meeting
const storySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    count: {
        type: Number
    }
});

const User = module.exports = mongoose.model('Story', storySchema);

module.exports.getStoryById = function(id, callback) {
    User.findbyId(id, callback);
};

module.exports.getStoryByTitle = function(title, callback) {
    const query = {title: title};
    User.findOne(query, callback);
};