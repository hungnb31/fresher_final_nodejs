const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

// controllers
const clientController = require('./client/controllers/shipmentController.js');

app.get('/', (req, res) => {
    res.send('Hello world!');
});

clientController(app);
app.listen(PORT, () => console.log('App listen on PORT ' + PORT));

module.exports = app;