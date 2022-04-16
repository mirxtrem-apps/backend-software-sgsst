const functions = require("firebase-functions");
const app = require('./src/app');

// Cloud Functions for SG-SST Software
exports.api = functions.https.onRequest(app);
