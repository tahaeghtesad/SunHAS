/**
 * Created by tahae on 6/29/2017.
 */
const express = require('express');
const router = express.Router();

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');
models.ruleModel = require('../model/ruleModel');

router.get('/', (req,res,next) => {
    models.ruleModel.find({}, (err, rules) => {
        if (err)
            res.send({code: 500, description: 'load failed'});
        else
            res.send(rules);
    });
});

router.put('/', (req,res,next) => {
    res.send('not implemented');
});

router.get('/:ruleId', (req,res,next) => {
    models.ruleModel.findOne({_id: req.params.ruleId}, (err, rule) => {
        if (err)
            res.send({code: 500, description: 'load failed'});
        else
            res.send(rule);
    });
});

router.post('/:ruleId', (req,res,next) => {
    res.send('not implemented');
});

router.delete('/:ruleId', (req,res,next) => {
    models.ruleModel.findOne({_id: req.params.ruleId}, (err, rule) => {
        if (err)
            res.send({code: 500, description: 'load failed.'});
        rule.remove((err) => {
            if (err)
                res.send({code: 503, description: 'delete failed.'});
            res.send({code: 200, description: 'removed.'});
        });
    });
});

module.exports = router;