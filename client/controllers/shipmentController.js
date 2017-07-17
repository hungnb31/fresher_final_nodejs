'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = require('../models/shipmentModel');


module.exports = (app) => {
    app.post('/client/getQuote', (req, res) => {
        let data = req.body.data, lastId;
        let stmt = db.prepare('INSERT INTO `users` (`ori_name`, `ori_email`, `ori_phone`, `ori_country_code`, `ori_locality`, `ori_postal_code`, ' +  
        '`ori_address`, `dest_name`, `dest_email`, `dest_phone`, `dest_country_code`, `dest_locality`, `dest_postal_code`, `dest_address`, `dimensions_height`, ' + 
        '`dimensions_width`, `dimensions_length`, `dimensions_unit`, `gross_amount`, `gross_unit`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        stmt.run(data.origin.contact.name, data.origin.contact.email, data.origin.contact.phone, data.origin.address.country_code, data.origin.address.locality, data.origin.address.postal_code,
        data.origin.address.address_line1, data.destination.contact.name, data.destination.contact.email, data.destination.contact.phone, data.destination.address.country_code, data.destination.address.locality, data.destination.address.postal_code,
        data.destination.address.address_line1, data.package.dimensions.height, data.package.dimensions.width, data.package.dimensions.length, data.package.dimensions.unit, data.package.grossWeight.amount, data.package.grossWeight.unit);

        let getLastId = () => {
            return new Promise((resolve, reject) => {
                db.get('SELECT last_insert_rowid() as id', (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        };

        let resUser = (id) => {
            return new Promise((resolve, reject) => {
                db.get('SELECT `id`, `gross_amount` FROM `users` WHERE id = ?', id, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        };
        
        getLastId().then(result => {
            resUser(result.id).then(result => {
                res.send({"data": result});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
        
    });


    app.post('/client/createShipment', (req, res) => {
        res.status(200).json({message: 'Create Shipment!'})
    });


    app.get('/client/getShipment', (req, res) => {  
        res.status(200).json({message: 'Get Shipment!'})
    });

    app.delete('/client/deleteShipment', (req, res) => {
        res.status(200).json({message: 'Delele Shipment!'})
    });
};