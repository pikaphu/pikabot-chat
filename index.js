require('dotenv').config({
    path: '.env'
});

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const verifyWebhook = require('./verify-webhook');
app.get('/', verifyWebhook);

const messageWebhook = require('./message-webhook');
app.post('/', messageWebhook);


app.get('/test', (req, res) => {
    var dt = Date.now()
    res.send('test ok: ' + dt);
});

app.listen(5000, () => console.log('Express server is listening on port 5000'));