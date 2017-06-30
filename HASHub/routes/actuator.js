/**
 * Created by tahae on 6/30/2017.
 */
const express = require('express');
const router = express.Router();

const models = require('../model/models');

router.get('/', (req,res,next) => {
    models.actuatorModel.find({}, '_id').exec((err, actuators) => {
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

router.put('/:actuatorId', (req,res,next) => {
    models.actuatorModel.find({_id: req.params.actuatorId}).exec((err, actuator) => {
        if (err)
            res.send({code: 500, description: err.message});
        else {
            actuator.location = req.body.location;
            actuator.description= req.body.description;
            if (!location)
                location = actuator.location;
            if (!description)
                description = actuator.description;

            models.locationModel.findOne({_id: req.body.location}).exec((err,location) => {
                if (location){
                    location.actuator.push(actuator);
                    location.save();
                    actuator.save((err) => {
                        if (err)
                            res.send({code: 500, description: err.message});
                        else
                            res.send(actuator);
                    });
                } else {
                    res.send({code: 500, description: 'location not found.'});
                }
            });
        }
    });
});

router.get('/newActuators', (req,res,next) => {
    models.actuatorModel.find({ location: null }).exec((err, actuators) => {
        if (err)
            res.send({code: 500, description: err.message});
        else
            res.send(actuators);
    });
});

module.exports = router;