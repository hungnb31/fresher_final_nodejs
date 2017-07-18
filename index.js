const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// set header
app.use(function(req, res, next) {
    res.setHeader('charset', 'utf-8');
    next();
});

// controllers
const clientController = require('./client/controllers/shipmentController.js');

app.get('/', (req, res) => {
    res.send('Hello world!');
});

clientController(app);
app.listen(PORT, () => console.log('App listen on PORT ' + PORT));

module.exports = app;


// MAKE BETTER
// I CAN DO IT