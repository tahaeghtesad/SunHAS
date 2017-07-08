/**
 * Created by tahae on 5/31/2017.
 */
const mongoose = require('./db-connection');
const Schema = mongoose.Schema;
const chipModel = mongoose.model('chip', new Schema(
    {
        cid: Number,//{type: Number, unique: true},
        ip: String,
        routerIp: String,
        ancestor: Number,
        actuators:[{type: Schema.ObjectId, ref: 'actuator'}],
        failures: [{errorCode: Number, cause: String, time: Date}]
    }, { timestamps: { createdAt: 'created_at' } }));

const locationSchema = new Schema(
    {
        name: String,
        description: String,
        parent: { type: Schema.ObjectId, ref: 'location' },
        agents:[{ type: Schema.ObjectId, ref: 'actuator' }]
    }, { timestamps: { createdAt: 'created_at' } });

locationSchema.index({'name': 'text'});

const locationModel = mongoose.model('location', locationSchema);

const actuatorModel = mongoose.model('actuator', new Schema(
    {
        actuatorKey: Number,
        function_: Number,
        chip: { type: Schema.ObjectId, ref: 'chip'},
        location: { type: Schema.ObjectId, ref: 'location'},

        states: [{ value: Number, time: Date }],
        description: String

    }, { timestamps: { createdAt: 'created_at' } }));


const logModel = mongoose.model('log', new Schema(
    {
        sender: Number,
        target: Number,
        code: Number,
        msg: String,
    }, { timestamps: { createdAt: 'created_at' } }));

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

let Function = {
    Temperature: 1,
    Humidity: 2,
    Door: 3,
    Light: 4,
    Lamp: 5
};

module.exports = {logModel, chipModel, locationModel, MessageCode, ErrorCode, Function, actuatorModel};
