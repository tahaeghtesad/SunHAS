/**
 * Created by tahae on 6/29/2017.
 */
const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

router.get('/', (req,res,next) => {
   models.locationModel.find({}, '_id').exec((err, locations) => {
       if (err)
           res.send({code: 500, description: err.message});
       else
           res.send(locations);
   });
});

router.post('/', (req,res,next) => {
    let location = {
        name: req.body.name,
        description: req.body.description,
        parent: req.body.parent
    };
   new models.locationModel(location).save((err, location) => {
       if (err)
           res.send({code: 500, description: err.message});
       else
           res.send(location);
   });
});

router.get('/:locationId', (req,res,next) => {
    models.locationModel.find({ _id: req.params.locationId }).exec((err, location) => {
        if (err)
            res.send({code: 500, description: err.message});
        else
            res.send(location);
    });
});

router.put('/:locationId', (req,res,next) => {
    models.locationModel.find({ _id: req.params.locationId }).exec((err, location) => {
        if (err)
            res.send({code: 500, description: err.message});
        else {
            location.name = req.body.name;
            location.description = req.body.description;
            location.parent = req.body.parent;
            location.save((err) => {
               if (err)
                   res.send( {code: 500, description: err.message} );
               else
                   res.send(location);
            });
        }
    });
});

router.delete('/:locationId', (req,res,next) => {
    models.locationModel.remove({ _id: req.params.locationId }, (err) => {
        if (err)
            res.send({code: 500, description: err.message});
        res.send({code: 200, description: 'removed'});
    })
});

module.exports = router;
