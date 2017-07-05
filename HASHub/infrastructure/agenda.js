/**
 * Created by tahae on 6/29/2017.
 */
const Agenda = require('agenda');

module.exports = new Agenda({db: {address: 'mongodb://sa:1@ds032887.mlab.com:32887/has'}});
