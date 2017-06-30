/**
 * Created by tahae on 5/31/2017.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/has', { useMongoClient: false }).then(
    () => { console.log('connected to db'); },
    (err) => { console.error('error connecting to database'); }
);

module.exports = mongoose;
