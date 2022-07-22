// set up express server
const { application } = require('express');
const express = require('express')
const app = express()
const port = 3000
var path = require('path');
const {MongoClient} = require("mongodb");
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");

// setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dummyemail9752@gmail.com',
      pass: 'Dummy123!'
    }
});

// setup body parser and path
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// root path 
const root = path.join(__dirname)


// main page
app.get('/', (req, res) => {
    res.sendFile('index.html', function(err){
        if(err){
            next(err)
        }
    })
})

// // styles
// app.get('/style.css', function(req, res) {
//     var options = {
//         root: root
//     };
//     res.sendFile('styles.css', options, function(err){
//         if(err){
//             next(err)
//         }
//     })  
// });


// // script
// app.get('/script.js', function(req, res) {
//     var options = {
//         root: root
//     };
//     res.sendFile('script.js', options, function(err){
//         if(err){
//             next(err)
//         }
//     })  
// });

app.post('/submit', (req, res) =>{
    // function to send email 
    const sendEmail = (to) => {
        var mailOptions = {
            from: 'dummyemail9752@gmail.com',
            to: to,
            subject: 'Contact Submission',
            text: 'Thanks for contacting us, we will be intouch!'
        };
        transporter.sendMail(mailOptions, function(error, res){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + res.response);
            }
        });
    }

    // connect to mongodb
    MongoClient.connect("mongodb+srv://dummy:dummy@cluster0.rjtr9.mongodb.net/?retryWrites=true&w=majority")
        .then(client =>{
            const db = client.db('donordrive');  
            const coll = db.collection("form_subs");
            // insert record
            coll.insertOne(req.body, (err, dbRes)=>{
                if(err) throw err;
                // send email and return result 
                sendEmail(req.body.email)
                res.json(dbRes);
            })
    });

})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})