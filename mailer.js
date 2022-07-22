// imports 
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


// create mail transporter
const createTransporter = async () => {
    // oauth2 client using google app credentials
    const authClient = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    // set refresh token
    authClient.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });
    
    // get access token
    const accessToken = await new Promise((resolve, reject) => {
        authClient.getAccessToken((err, token) => {
        if (err) {
          reject();
        }
        resolve(token);
      });
    });
  
    // transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    });
  
    return transporter;
};

// function to send email
const mailer =async(options)=>{
    // init transporter
    let transporter = await createTransporter();
    await transporter.sendMail(options);
};

// export mailer
module.exports = mailer