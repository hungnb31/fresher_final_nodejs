'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = require('../models/shipmentModel');


module.exports = (app) => {
    // GET QUOTE
    app.post('/client/getQuote', (req, res) => {
        let data = req.body.data;
        let stmt = db.prepare('INSERT INTO `quote` (`ori_name`, `ori_email`, `ori_phone`, `ori_country_code`, `ori_locality`, `ori_postal_code`, ' +  
        '`ori_address`, `dest_name`, `dest_email`, `dest_phone`, `dest_country_code`, `dest_locality`, `dest_postal_code`, `dest_address`, `dimensions_height`, ' + 
        '`dimensions_width`, `dimensions_length`, `dimensions_unit`, `gross_amount`, `gross_unit`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        stmt.run(data.origin.contact.name, data.origin.contact.email, data.origin.contact.phone, data.origin.address.country_code, data.origin.address.locality, data.origin.address.postal_code,
        data.origin.address.address_line1, data.destination.contact.name, data.destination.contact.email, data.destination.contact.phone, data.destination.address.country_code, data.destination.address.locality, data.destination.address.postal_code,
        data.destination.address.address_line1, data.package.dimensions.height, data.package.dimensions.width, data.package.dimensions.length, data.package.dimensions.unit, data.package.grossWeight.amount, data.package.grossWeight.unit);
        console.log('Quote inserted!');
        // get last id on table quote
        let getLastId = () => {
            return new Promise((resolve, reject) => {
                db.get('SELECT last_insert_rowid() as id FROM `quote`', (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        };

        // get response for user
        let resUser = (id) => {
            return new Promise((resolve, reject) => {
                db.get('SELECT `id`, `gross_amount` FROM `quote` WHERE id = ?', id, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        };
        
        // send response for user
        getLastId().then(result => {
            resUser(result.id).then(result => {
                res.send({"data": result});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

    });

    // CREAT SHIPMENT
    app.post('/client/createShipment', (req, res) => {
        let data = req.body.data;
        let stmt = db.prepare('INSERT INTO `shipment` (`ref`, `created_at`, `ori_name`, `ori_email`, `ori_phone`, `ori_country_code`, `ori_locality`, `ori_postal_code`, ' +  
        '`ori_address`, `ori_organisation`, `dest_name`, `dest_email`, `dest_phone`, `dest_country_code`, `dest_locality`, `dest_postal_code`, `dest_address`, `dest_organisation`, `dimensions_height`, ' + 
        '`dimensions_width`, `dimensions_length`, `dimensions_unit`, `gross_amount`, `gross_unit`, `quote_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        // generate random number
        let randomNum = Math.random().toString().substring(2, 12);

        // get time
        let createTime = new Date();

        console.log(createTime);

        stmt.run(randomNum, createTime, data.origin.contact.name, data.origin.contact.email, data.origin.contact.phone, data.origin.address.country_code, data.origin.address.locality, data.origin.address.postal_code,
        data.origin.address.address_line1, data.origin.address.organisation, data.destination.contact.name, data.destination.contact.email, data.destination.contact.phone, data.destination.address.country_code, data.destination.address.locality, data.destination.address.postal_code,
        data.destination.address.address_line1, data.destination.address.organisation, data.package.dimensions.height, data.package.dimensions.width, data.package.dimensions.length, data.package.dimensions.unit, data.package.grossWeight.amount, data.package.grossWeight.unit, data.quote.id);
        console.log('Shipment inserted!');
        
        // get response for user
        let resUser = () => {

        }

        res.send('Done!');
    });

    // GET SHIPMENT
    app.get('/client/getShipment', (req, res) => {  
        res.status(200).json({message: 'Get Shipment!'})
    });


    // DELETE SHIPMENT
    app.delete('/client/deleteShipment', (req, res) => {
        res.status(200).json({message: 'Delele Shipment!'})
    });
};