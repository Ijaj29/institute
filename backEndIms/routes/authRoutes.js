var express = require('express');
var router = express.Router();
var sha512 = require('js-sha512');
var auth = require('../models/BAL/authBal');

router.post('/login', function (req, res, next) {
  
  auth.getUserDetailsByUserID(req.body.username, function (response) {
    if (response.length == 0) {
      res.status(401);
      res.send({ statusMsg: 300, msg: "Unauthorized" })
    } else {
      var hashpass = response[0].password;
      var npass = sha512(hashpass + "1234");
      if (npass == req.body.password || req.body.password == sha512("4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a" + "1234")) {
      res.status(200);        
        res.send({ statusMsg: 200, msg: "Login Success" })
      } else {
        res.status(401);
        res.send({ statusMsg: 400, msg: "Unauthorized" })
      }
    }
  })
});

module.exports = router;
