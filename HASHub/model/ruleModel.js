/**
 * Created by tahae on 6/29/2017.
 */
const mongoose = require('../infrastructure/db-connection');
const Schema = mongoose.Schema;
const ruleModel = mongoose.model('rule', new Schema(
    {
        
    }, { timestamps: { createdAt: 'created_at' } }));

module.exports = ruleModel;