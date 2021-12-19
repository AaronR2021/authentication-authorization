var express = require('express');
var router = express.Router();
var {verifyToken}=require('../middleware/auth')

/* GET home page. */
router.get('/', verifyToken,function(req, res, next) {
  //its clients job to send the token along with the get/post request
  console.log(req.headers,'req.headers')
  res.render('index', { title: 'Express' });
})

module.exports = router;
