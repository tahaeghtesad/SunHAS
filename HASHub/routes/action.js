/**
 * Created by tahae on 6/29/2017.
 */

const prettyjson = require('prettyjson');

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

router.post('/', (req, res, next) => {
    console.log(req.body.response.msg_body);
    let entities = req.body.response.outcome.entities;

    let function_ = entities.intent.value;
    let action = entities.action ? entities.action.body : '';
    let location = entities.location ? entities.location.body : '';
    let value = action  === 'turn' ? (entities.on_off.value === 'off' ? 0 : 100) : entities.number.value;

    console.log(`dimming all lights to ${value}`);

    let findCriteria = location === 'all' ? {} : {$text: {$search: location}};

    models.actuatorModel.find({function_: models.Function.Light}).populate('chip').exec((err, actuators) => {
        if(err)
            res.send({code: 500, description: err.message});
        else {
            for (let i = 0; i < actuators.length; i++) {
                connector.setState(
                    actuators[i].chip.cid,
                    actuators[i].chip.routerIp,
                    actuators[i].actuatorKey,
                    value
                );
            }
            let message = `${action}ing ${location} lights ${action === 'turn' ? (value === 0 ? 'off' : 'on') : `to ${value} percent`}`;
            console.log(message);
            res.send({code: 200, description: 'done', message: message});
        }
    });
});

module.exports = router;
