/**
 * Created by tahae on 6/30/2017.
 */
const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

router.get('/', (req,res,next) => {
    models.actuatorModel.find({}).exec((err, actuators) => {
        if (err)
            res.send({code: 500, description: err});
        else
            res.send(actuators);
    });
});

router.get('/:actuatorId', (req,res,next) => {
    models.actuatorModel.find({_id: req.params.actuatorId}).exec((err, actuator) => {
        if (err)
            res.send({code: 500, description: err});
        else
            res.send(actuator);
    });
});

router.post('/:actuatorId', (req,res,next) => {
    models.actuatorModel.find({_id: req.params.actuatorId}).exec((err, actuator) => {
        if (err)
            res.send({code: 500, description: err});
        else {
            actuator.location = req.body.location;
            actuator.description= req.body.description;
            actuator.save((err) => {
                if (err)
                    res.send({code: 500, description: err});
                else
                    res.send(actuator);
            })
        }
    });
});

router.get('/newActuators', (req,res,next) => {
    models.actuatorModel.find({ location: null }).exec((err, actuators) => {
        if (err)
            res.send({code: 500, description: err});
        else
            res.send(actuators);
    });
});

module.exports = router;