'use strict';

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

// setup database
var dbFile = './database/api_shipment.db';


var dbExists = fs.existsSync(dbFile);

// Initialize the database
var db = new sqlite3.Database(dbFile);
var dataRate = require('../data/rate.json');

db.serialize(() => {

    // Optional installation for newly created database
    db.run('CREATE TABLE IF NOT EXISTS `rate` (' +
    '`weight` TEXT NOT NULL,' +
    '`price` DOUBLE NOT NULL,' +
    '`fromCountry` TEXT NOT NULL,' + 
    '`toCountry` TEXT NOT NULL)');

    // Insert data
    var stmt = db.prepare('INSERT INTO `rate` (`weight`, `price`, `fromCountry`, `toCountry`) ' + 
        'VALUES (?, ?, ?, ?) ');
    for (let i in dataRate) {
        stmt.run(dataRate[i].weight, dataRate[i].price, dataRate[i].fromCountry, dataRate[i].toCountry);
    }
    stmt.finalize();
});

db.close();

module.exports = db;