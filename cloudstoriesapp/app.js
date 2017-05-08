// import all the necessary modules and files
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

const suburbs = require('./models/suburbs')

// specifying the connection for our database 
// which is stored in a config file
// mongodb://115.146.95.71:27017/rawtweetsdbLive
const url = 'mongodb://'+config.username+':'+config.password+'@'+config.host+':'+config.port+'/'+config.database+'?authSource='+config.authSource;
mongoose.connect(url);

// a listener for database connected event
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database.substr(config.database.lastIndexOf('/') + 1));
    // suburbs.Polygon.findOne({}, { "value": 1 }, (err, data) => {
    //     if (err) {
    //         console.log("An error has occurred while trying to execute this request\n" + '"' + err.errmsg + '"')
    //     }
    //     else {
    //         console.log(data.value.text);
    //     }
    // });
});

// a listener for error in connection event
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

// enabling express for the app.js
const app = express();

// set all the directory variables
const stories = require('./routes/stories')

// our web app will use this port
const port = 3000;

// CORS Middleware
app.use(cors());

// Set STATIC folder for client side
app.use(express.static(path.join(__dirname, 'public')))

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// bring the stories route into scope
app.use('/stories', stories);

// configuring routes for end-points
// Index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
});

// this is to test that the app started properly
app.listen(port, () => {
    console.log('Server started on port ' + port);
});