/**
 * Created by tahae on 5/31/2017.
 */

const mongoose = require('./db-connection').mongoose;

const model = require('./models');
const chipModel = model.chipModel;

const MessageCode = require('./models').MessageCode;

function messageParser(msg, src, ip){
    let code = msg[0];
    switch(code){
        case MessageCode.Keep_Alive:
            keepAlive(msg.slice(1), src, ip);
            break;
        case MessageCode.Info:
            info(msg.slice(1), src);
            break;
        case MessageCode.ChangedState:
            info(msg.slice(1), src);
            break;
    }
}

function keepAlive(msg, src, ip){
    actuators = [];
    for (let i = 8; i < msg.length; i+=2)
        actuators.push({
            actuatorKey: msg[i],
            function_: msg[i+1]
        });
    let newState = {
        cid: src,
        ip: `${msg[0]}.${msg[1]}.${msg[2]}.${msg[3]}`,
        routerIp: ip,
        ancestor: msg.readUInt32BE(4)
    };

    let chip = chipModel.findOne({cid: src}).exec((err, chip) => {
        if (chip){
            chip.cid = src;
            chip.ip = `${msg[0]}.${msg[1]}.${msg[2]}.${msg[3]}`;
            chip.routerIp = ip;
            chip.ancestor = msg.readUInt32BE(4);
            chip.save();
        } else {
            let chip = new chipModel(newState);
            chip.save((err) => {
                for(let i = 0; i < actuators.length; i++){
                    actuators[i].chip = chip._id;
                    let actuator = new model.actuatorModel(actuators[i]);
                    actuator.save((err) => {
                        chip.actuators.push(actuator._id);
                        chip.save();
                    });
                }
            });
        }
    });
}

function info(msg, src){
    let actuatorsInfo = [];
    let actuators = [];
    for(let i = 0; i < msg.length/5; i++){
        let actuatorKey = msg[i*5];
        let value = msg.readFloatBE(i * 5 + 1);
        actuatorsInfo[actuatorKey] = value;
        actuators.push(actuatorKey);
    }

    chipModel.findOne({cid: src}).populate({
        path: 'actuators',
        match: {
            actuatorKey : {$in: actuators}
        }
    }).exec((err, chip) => {
        if (chip) {
            for (let i = 0; i < chip.actuators.length; i++) {
                chip.actuators[i].states.push({
                    value: actuatorsInfo[chip.actuators[i].actuatorKey],
                    time: Date.now()
                });
            }
            chip.save();
        }
    });
}

function error(msg, src){
    let agent = agentModel.findOne({cid: src}).exec((err, agent) => {
        let code = msg[0];
        let cause = msg.slice(1).toString();
        agent.failures.push({errorCode: code, cause: cause, time: Date.now()});
        agent.save((err) => {
            if (err)
                console.error(err);
        });
    });
}

module.exports = messageParser;
