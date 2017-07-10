/**
 * Created by tahae on 6/30/2017.
 */
const express = require('express');
const router = express.Router();

const models = require('../model/models');

router.get('/', (req,res,next) => {
   models.chipModel.find({}, '_id').exec((err, chips) => {
       if (err)
           res.send({code: 500, description: err.message});
       else
           res.send(chips);
   });
});

router.get('/:chipId', (req,res,next) => {
    models.chipModel.findOne({ _id: req.params.chipId }).exec((err, chips) => {
        if (err)
            res.send({code: 500, description: err.message});
        else
            res.send(chips);
    });
});

module.exports = router;