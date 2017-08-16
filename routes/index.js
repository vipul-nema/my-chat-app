var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
	
  res.render('index', { title: 'My Chat Application', time :Math.random() });
});

module.exports = router;
