/**
 * Created by tahae on 6/29/2017.
 */
const express = require('express');
const router = express.Router();
const connector = require('../infrastructure/connector-connection');

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

router.get('/:actuatorId/:value', (req, res, next) => {
    console.log(req.params.actuatorId);
    console.log(req.params.value);
    models.actuatorModel.findOne({ _id: req.params.actuatorId }).populate('chip').exec((err, actuator) => {
       if (err)
           res.send({code: 500, description: err.message});
       else if (require('../model/helpers').isSensor(actuator.function_))
           res.send({code: 500, description: 'not an actuator'});
       else {
           connector.setState(
               actuator.chip.cid,
               actuator.chip.routerIp,
               actuator.actuatorKey,
               req.params.value
           );
           res.send({code: 200, description: 'done'});
       }
    });
});

module.exports = router;
