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
                res.send({ "data": result });
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

    });

    // CREAT SHIPMENT
    app.post('/client/createShipment', (req, res) => {
        let data = req.body.data, cost;
        let stmt = db.prepare('INSERT INTO `shipment` (`ref`, `created_at`, `ori_name`, `ori_email`, `ori_phone`, `ori_country_code`, `ori_locality`, `ori_postal_code`, ' +
            '`ori_address`, `ori_organisation`, `dest_name`, `dest_email`, `dest_phone`, `dest_country_code`, `dest_locality`, `dest_postal_code`, `dest_address`, `dest_organisation`, `dimensions_height`, ' +
            '`dimensions_width`, `dimensions_length`, `dimensions_unit`, `gross_amount`, `gross_unit`, `quote_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        // generate random number
        let randomNum = Math.random().toString().substring(2, 12);

        // get time
        let createTime = new Date();

        stmt.run(randomNum, createTime, data.origin.contact.name, data.origin.contact.email, data.origin.contact.phone, data.origin.address.country_code, data.origin.address.locality, data.origin.address.postal_code,
            data.origin.address.address_line1, data.origin.address.organisation, data.destination.contact.name, data.destination.contact.email, data.destination.contact.phone, data.destination.address.country_code, data.destination.address.locality, data.destination.address.postal_code,
            data.destination.address.address_line1, data.destination.address.organisation, data.package.dimensions.height, data.package.dimensions.width, data.package.dimensions.length, data.package.dimensions.unit, data.package.grossWeight.amount, data.package.grossWeight.unit, data.quote.id);
        console.log('Shipment inserted!');

        // get quote
        let getQuote = () => {
            return new Promise((resolve, reject) => {
                db.get('SELECT `dest_country_code`, `ori_country_code`, `gross_amount`, `gross_unit` FROM `quote` WHERE id = ?', data.quote.id, (err, result) => {
                    if (err) return reject(err);
                    return resolve(result);
                })
            })
        };

        // calculate cost
        let getWeightPrice = () => {
            return new Promise((resolve, reject) => {
                getQuote().then(x => {
                    db.all('SELECT `weight`, `price` FROM `rate` WHERE toCountry = ? AND fromCountry = ?', x.dest_country_code, x.ori_country_code, (err, y) => {
                        if (err) return reject(err);
                        return resolve(y);
                    })
                }).catch(err => reject(err));
            })
        };

        let getCost = () => {
            return new Promise((resolve, reject) => {
                let amount = data.package.grossWeight.amount, unit = data.package.grossWeight.unit;
                getWeightPrice().then(result => {
                    if (unit == 'kg') { amount *= 1000 }
                    for (let i of result) {
                        if (i.weight == '<250') {
                            if (amount < 250) {
                                return resolve(i.price)
                            }
                        } else if (i.weight == '>15000') {
                            if (amount > 15000) {
                                return resolve(i.price);
                            }
                        } else if (amount == +i.weight) {
                            return resolve(i.price);
                        }
                    }
                }).catch(err => reject(err))
            })
        }

        getCost().then(result => res.send({ 'data': [{ 'ref': randomNum, 'created_at': createTime, 'cost': result }] }));
    });

    // GET SHIPMENT
    app.post('/client/getShipment', (req, res) => {
        let data = req.body.data;

        // get info of shipment
        let getInfo = () => {
            return new Promise((resolve, reject) => {
                db.get('SELECT `ref`, `created_at`, `ori_name`, `ori_email`, `ori_phone`, `ori_country_code`, `ori_locality`, `ori_postal_code`, ' +
                    '`ori_address`, `ori_organisation`, `dest_name`, `dest_email`, `dest_phone`, `dest_country_code`, `dest_locality`, `dest_postal_code`, `dest_address`, `dest_organisation`, `dimensions_height`, ' +
                    '`dimensions_width`, `dimensions_length`, `dimensions_unit`, `gross_amount`, `gross_unit`, `quote_id` FROM `shipment` WHERE ref = ?', data.ref, (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                })
            })
        }

        let resUser = () => {
            return new Promise((resolve, reject) => {
                getInfo().then(result => {
                    let x = {
                        "data": {
                            "ref": ""
                        }
                    }
                    if (result) {
                            x = {
                            "data": {
                                "ref": result.ref,
                                "origin": {
                                    "contact": {
                                        "name": result.ori_name,
                                        "email": result.ori_email,
                                        "phone": result.ori_phone
                                    },
                                    "address": {
                                        "country_code": result.ori_country_code,
                                        "locality": result.ori_locality,
                                        "postal_code": result.ori_postal_code,
                                        "address_line1": result.ori_address,
                                        "organisation": result.ori_organisation
                                    }
                                },
                                "destination": {
                                    "contact": {
                                        "name": result.dest_name,
                                        "email": result.dest_email,
                                        "phone": result.dest_phone
                                    },
                                    "address": {
                                        "country_code": result.dest_country_code,
                                        "locality": result.dest_locality,
                                        "postal_code": result.dest_postal_code,
                                        "address_line1": result.dest_address,
                                        "organisation": result.dest_organisation
                                    }
                                },
                                "package": {
                                    "dimensions": {
                                        "height": result.dimensions_height,
                                        "width": result.dimensions_width,
                                        "length": result.dimensions_length,
                                        "unit": result.dimensions_unit
                                    },
                                    "grossWeight": {
                                        "amount": result.gross_amount,
                                        "unit": result.gross_unit
                                    }
                                }
                            }
                        }
                    }
                    return resolve(x);
                }).catch(err => reject(err))
            })
        }

        resUser().then(x => res.send(x)).catch(err => res.send(err));
    });


    // DELETE SHIPMENT
    app.post('/client/deleteShipment', (req, res) => {
        let data = req.body.data;

        // delete shipment
        let delShipment = () => {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM `shipment` WHERE ref = ?', data.ref, (err, result) => {
                    if (err) return reject(err);
                    let x = {
                            "data": [
                                {
                                    "status": "NOK",
                                    "message": "Can't found the shipment"
                                }
                            ]
                        }
                    if (result) {
                        db.run('DELETE FROM `shipment` WHERE ref = ?', data.ref);
                        x = {
                            "data": [
                                {
                                    "status": "OK",
                                    "message": "Shipment has been deleted"
                                }
                            ]
                        }
                    }
                    return resolve(x);
                })
            })
        };

        delShipment().then(x => res.send(x)).catch(err => console.log(err));
    });
};


// MAKE BETTER
// I CAN DO IT