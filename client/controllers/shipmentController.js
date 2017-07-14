var sqlite3 = require('sqlite3').verbose();
var db = require('../models/shipmentModel.js');


module.exports = (app) => {
    app.get('/client/getQuote', (req, res) => {
        res.status(200).json({message: 'Get Quote!'})
    });


    app.post('/client/createshipment', (req, res) => {
        res.status(200).json({message: 'Create Shipment!'})
    });


    app.get('/client/getshipment', (req, res) => {  
        res.status(200).json({message: 'Get Shipment!'})
    });

    app.delete('/client/deleteshipment', (req, res) => {
        res.status(200).json({message: 'Delele Shipment!'})
    });
};