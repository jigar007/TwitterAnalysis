// this is the route page for stories.
// we can have index to differenct stories here on this page
const express = require('express');
const router = express.Router();
const User = require('../models/story');

// different STORIES
router.get('/tourism', (req, res, next) => {
    res.send('inside tourism story!');
});

router.get('/health', (req, res, next) => {
    res.send('inside health story!');
});

router.get('/shopping', (req, res, next) => {
    res.send('inside shopping story!');
});
// end of different stories routes

module.exports = router;