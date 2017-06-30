const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/cron', (req,res,next) => {
   res.render('cron', { title: 'cron' });
});

module.exports = router;
