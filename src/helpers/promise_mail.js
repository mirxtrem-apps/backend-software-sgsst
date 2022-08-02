const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "sd1985.colombiasolutions.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "soporte@segsas.com",
    pass: "c%T*b~S9M(fM",
  },
});

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error:' + error);
        reject(error);
      } else {
        console.log('Success:' + info);
        resolve(info.response);
      }
    });
  });
};

module.exports = sendEmail;
