// set up express server and import dependencies
const express = require('express');
const app = express();
const port = 3000;
var path = require('path');
const {MongoClient} = require("mongodb");
const mailer = require('./mailer');

// configure environment variables
require('dotenv').config();

// setup body parser and path
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// main page
app.get('/', (req, res) => {
    res.sendFile('index.html', function(err){
        if(err){
            next(err);
        };
    });
});

// form submission route
app.post('/submit', (req, res) =>{
    // connect to mongodb
    MongoClient.connect(process.env.MONGO_URI)
        .then(client =>{
            const db = client.db('donordrive');  
            const coll = db.collection("form_subs");
            // insert record
            coll.insertOne(req.body, (err, dbRes)=>{
                if(err) throw err;
                // send email and return result 
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: req.body.email,
                    subject: 'Contact Submission',
                    html: '<h5>Thanks for contacting us, we will be in touch!</h5>'
                };                
                mailer(mailOptions);
                res.json(dbRes);
            });
    });

});

// listen on port 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});