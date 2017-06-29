/**
 * Created by tahae on 6/29/2017.
 */
const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

/* GET home page. */
router.get('/',  (req, res, next) => {
  models.agentModel.find({}, (err, agents) => {
    res.send(agents);
  });
});

router.get('/:nodeId', (req, res, next) => {
    models.agentModel.findOne({cid: req.params.nodeId}, (err, agent) => {
        res.send(agent);
    });
});

router.post('/:nodeId', (req, res, next) => {
    models.agentModel.findOne({cid: req.params.nodeId}, (err, agent) => {
        agent.location._id = req.body.location;
        agent.description = req.body.description;
        agent.save((err => {
            if (err)
                res.send({code: 502, description: 'update failed.'});
            else
                res.send(agent);
        }));
    });
});

module.exports = router;
