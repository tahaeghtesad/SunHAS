/**
 * Created by tahae on 6/29/2017.
 */
const Agenda = require('agenda');

module.exports = new Agenda({db: {address: 'mongodb://localhost/has'}});
