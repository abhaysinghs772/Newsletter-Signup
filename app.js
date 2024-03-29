const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/451aff3db8";

    const options = {
        method: "POST",
        auth: process.env.AUTH
    }

    const request = https.request(url, options, function (response) {

        var a = response.statusCode;
        if (a === 200) {
            res.sendfile(__dirname + "/success.html");
        }
        else {
            res.sendfile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure.html', function(req, res){
    res.sendFile(__dirname+ '/signup.html');
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server is started at port 3000');
});
