var express = require('express');
var router = express.Router();
var contactRouter = require("./contact")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use("/contact", contactRouter);
module.exports = router;
