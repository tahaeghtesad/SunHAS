/**
 * Created by tahae on 5/31/2017.
 */
const mongoose = require('./db-connection');
const Schema = mongoose.Schema;
const agentModel = mongoose.model('agent', new Schema(
    {
        cid: Number,//{type: Number, unique: true},
        ip: String,
        routerIp: String,
        ancestor: Number,
        functions: [Number],
        location: { type: Schema.ObjectId, ref: 'location' },
        description: String,
        infos: [{number: Number, agentKey: Number, value: Number, time: Date}],
        states: [{number: Number, agentKey: Number, value: Number}],
        errors: [{errorCode: Number, cause: String, time: Date}]
    }, { timestamps: { createdAt: 'created_at' } }));

const locationModel = mongoose.model('location', new Schema(
    {
        name: String,
        agents:[{ type: Schema.ObjectId, ref: 'agent' }]
    }, { timestamps: { createdAt: 'created_at' } }));

const logModel = mongoose.model('log', new Schema(
    {
        sender: Number,
        target: Number,
        msg: String,
    }, { timestamps: { createdAt: 'created_at' } }));

let RecurrencePeriod = {
    Hourly: 1,
    Daily: 2,
    Weekly: 3,
    Monthly: 4
};

let MessageCode = {
    Keep_Alive: 1,
    Info: 3,
    ChangedState: 4, // ESP-to-server
    Error: -1,
    Time: 2,
    SetState: 5 //Server-to-ESP
};

let ErrorCode = {
    WatchDog_Reset: 1,
    Reset: 2,
    Turn_On: 3
};

let AgentKey = {
    Temperature: 1,
    Humidity: 2,
    Door: 3,
    Light: 4,
    Lamp: 5
};

module.exports = {logModel, agentModel, locationModel, MessageCode, ErrorCode, AgentKey};