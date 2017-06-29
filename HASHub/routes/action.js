/**
* Created by tahae on 6/29/2017.
*/
const express = require('express');
const router = express.Router();
const connector = require('../infrastructure/connector-connection');

const mongoose = require('../infrastructure/db-connection');
const models = require('../model/models');

router.get('/lights/:chip/:actuator/:value', (req, res, next) => {
    //todo refactor this (currently bullshit)
    connector.setState(
        req.params.chip,
        req.params.actuator,
        4,
        req.params.value
    )
});

module.exports = router;
