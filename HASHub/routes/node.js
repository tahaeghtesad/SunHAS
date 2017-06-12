const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.agentModel.find({}, (err, agents) => {
    res.send(agents);
  })
});

module.exports = router;
