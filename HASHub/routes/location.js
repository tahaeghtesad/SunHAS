/**
 * Created by tahae on 6/29/2017.
 */
const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

router.get('/',  (req, res, next) => {
    models.locationModel.find({}, (err, locations) => {
        res.send(locations);
    });
});

router.get('/:locationId', (req, res, next) => {
    models.locationModel.findOne({_id: req.params.locationId}, (err, location) => {
        res.send(location);
    });
});

router.post('/:locationId', (req, res, next) => {
    //todo refactor this
    models.locationModel.findOne({_id: req.params.locationId}, (err, location) => {
        location.name = req.body.name;
        location.save((err) => {
            if (err)
                res.send({code: 502, description: 'update failed.'});
            else
                res.send(location);
        });
    });
});

router.delete('/:locationId', (req, res, next) => {
    models.locationModel.findOne({_id: req.params.locationId}, (err, location) => {
        location.remove((err) => {
            if (err)
                res.send({code: 503, description: 'remove failed.'})
            res.send({code: 200, description: 'removed.'})
        });
    });
});

router.put('/', (req, res, next) => {
    //todo refactor this
    let model = new models.locationModel({
        name: req.body.name
    });

    model.save((err) => {
        if (err)
            res.send({code: 501, description: 'create failed.'});
        else
            res.send(model);
    });
});

module.exports = router;
