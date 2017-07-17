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

    db.run('CREATE TABLE IF NOT EXISTS `users` (' +
    '`id` INTEGER PRIMARY KEY NOT NULL, ' +
    '`ori_name` TEXT NOT NULL, ' +
    '`ori_email` TEXT NOT NULL, ' + 
    '`ori_phone` TEXT NOT NULL, ' +
    '`ori_country_code` TEXT NOT NULL, ' +
    '`ori_locality` TEXT NOT NULL, ' +
    '`ori_postal_code` TEXT NOT NULL, ' +
    '`ori_address` TEXT NOT NULL, ' +
    '`dest_name` TEXT NOT NULL, ' +
    '`dest_email` TEXT NOT NULL, ' + 
    '`dest_phone` TEXT NOT NULL, ' +
    '`dest_country_code` TEXT NOT NULL, ' +
    '`dest_locality` TEXT NOT NULL, ' +
    '`dest_postal_code` TEXT NOT NULL, ' +
    '`dest_address` TEXT NOT NULL, ' +
    '`dimensions_height` INTEGER NOT NULL, ' + 
    '`dimensions_width` INTEGER NOT NULL, ' +
    '`dimensions_length` INTEGER NOT NULL, ' +
    '`dimensions_unit` INTEGER NOT NULL, ' +
    '`gross_amount` INTEGER NOT NULL, ' +
    '`gross_unit` TEXT NOT NULL)');
 
    // Insert data
    var stmt = db.prepare('INSERT INTO `rate` (`weight`, `price`, `fromCountry`, `toCountry`) ' + 
        'VALUES (?, ?, ?, ?) ');
    for (let i = 0; i < dataRate.length; i++)  {
        stmt.run(dataRate[i].weight, dataRate[i].price, dataRate[i].fromCountry, dataRate[i].toCountry);
    }
    stmt.finalize();
});

module.exports = db;