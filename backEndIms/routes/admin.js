var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var csrf = require('csurf');
var csrfProtection = csrf({  cookie: {secure: true, httpOnly: true,sameSite: "strict"}});
var parseForm = bodyParser.urlencoded({ extended: false });
const cache = require('cache-headers');
var permit = require('../models/middleWare/permission');
const { verifyToken } = require('../models/middleWare/jwtHelper');
var crypto = require('crypto'),
  format = require('biguint-format'),
const axios = require('axios');


const overrideConfig = {
  "maxAge": 6000,
  "setPrivate": true,
  "staleError": "number",
  "staleRevalidate": "number",
  "lastModified": "string",
};

function randomC(qty) {
  var x = crypto.randomBytes(qty);
  return format(x, 'dec');
}
function random(low, high) {
  return randomC(4) / Math.pow(2, 4 * 8 - 1) * (high - low) + low;
}



router.get('/addAnalyst', verifyToken, permit.permission("ADMIN"), csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res) {
    return res.status(200).json({ statusMsg: 200, msg: 'Dashboard'});
});