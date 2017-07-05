/**
 * Created by tahae on 5/31/2017.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://sa:1@ds032887.mlab.com:32887/has', { useMongoClient: false }).then(
    () => { console.log('connected to db'); },
    (err) => { console.error('error connecting to database'); }
);

module.exports = mongoose;
