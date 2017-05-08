// this is the route page for stories.
// we can have index to differenct stories here on this page
const express = require('express');
const router = express.Router();
const User = require('../models/suburbs');

// different STORIES
router.get('/news', (req, res) => {
    res.json({'name':'Shivank'});
});

router.get('/health', (req, res) => {
    res.json({'name':'Shivank'});
});

router.get('/shows', (req, res) => {
    res.json({'name':'Shivank'});
});
// end of different stories routes

module.exports = router;