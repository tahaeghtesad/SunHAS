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
 * * * * *
 | | | | |
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
    let cron = req.body.cron;
    let actuator = req.body.actuator;
    let value = req.body.value;
    let name = actuator + '-' + Date.now();

    console.log(`${name} ${cron} ${actuator} ${value}`);

    models.actuatorModel.findOne({ _id: actuator }).populate('chip').exec((err, actuator) => {
        if (err)
            res.send({code: 500, description: err.message});
        else if (require('../model/helpers').isSensor(actuator.Function))
            res.send({code: 500, description: 'not an actuator'});
        else {
            agenda.define(name, (job, done) => {
                connector.setState(
                    job.attrs.data.chip,//actuator.chip.cid,
                    job.attrs.data.routerIp,
                    job.attrs.data.actuator,//actuator._id,
                    job.attrs.data.value //value
                );

                models.actuatorModel.findById(job.attrs.data.actuatorId, (err, actuator) => {
                    actuator.states.push({value: job.attrs.data.value, time: Date.now()});
                    actuator.save();
                });

                done();
            });

            let job = agenda.every(cron, name, {
                actuatorId: actuator._id,
                chip: actuator.chip.cid,
                routerIp: actuator.chip.routerIp,
                actuator: actuator.actuatorKey,
                value: value
            });

            res.send(job);
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
