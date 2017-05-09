// this is the route page for stories.
// we can have index to different stories here on this page
const express = require('express');
const router = express.Router();
const Models = require('../models/suburbs');
const mongoose = require('mongoose');

// different STORIES
router.get('/newsData', (req, res) => {
    Models.getNewsData((err, data) => {
        res.json(data);
    });
});

router.get('/healthData', (req, res) => {
    Models.getHealthData((err, data) => {
        res.json(data);
    });
});

router.get('/showsData', (req, res) => {
    Models.getShowsData((err, data) => {
        res.json(data);
    });
});

router.get('/miscData', (req, res) => {
    Models.getMiscData((err, data) => {
        res.json(data);
    });
});
// end of different stories routes

module.exports = router;