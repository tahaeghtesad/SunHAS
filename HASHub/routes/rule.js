/**
 * Created by tahae on 6/30/2017.
 */
const express = require('express');
const router = express.Router();
const connector = require('../infrastructure/connector-connection');

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');
const agenda = require('../infrastructure/agenda');


/**
 * * * * * *
 | | | | | |
 | | | | | +-- Year              (range: 1900-3000)
 | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
 | | | +------ Month of the Year (range: 1-12)
 | | +-------- Day of the Month  (range: 1-31)
 | +---------- Hour              (range: 0-23)
 +------------ Minute            (range: 0-59)
 */


router.get('/', (req,res,next) => {
    agenda.jobs({}, function(err, jobs) {
        if (err)
            res.send({code: 500, description: err});
        else
            res.send(jobs);
    });
});

router.post('/', (req,res,next) => {
    let name = req.body.name;
    let cron = req.body.cron;
    let actuator = req.body.actuator;
    let value = req.body.value;


    models.actuatorModel.findOne({ _id: actuator }).populate('chip').exec((err, actuator) => {
        if (err)
            res.send({code: 500, description: err.message});
        else if (require('../model/helpers').isSensor(actuator.Function))
            res.send({code: 500, description: 'not an actuator'});
        else {
            agenda.define(name, (job, done) => {
                connector.setState(
                    job.attrs.data.chip,//actuator.chip.cid,
                    job.attrs.data.actuator,//actuator._id,
                    job.attrs.data.value //value
                );
                done();
            });

            agenda.every(cron, name, {
                chip: actuator.chip.cid,
                actuator: actuator._id,
                value: value
            });
        }
    });
});

router.delete('/:name', (req,res,next) => {
   agenda.cancel({name: req.params.name}, (err, numRemoved) => {
       if (err)
           res.send({code: 500, description: err});
       else
           res.send({numRemoved: numRemoved});
   });
});

module.exports = router;
