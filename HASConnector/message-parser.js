/**
 * Created by tahae on 5/31/2017.
 */

const mongoose = require('./db-connection').mongoose;

const agentModel = require('./models').agentModel;

const MessageCode = require('./models').MessageCode;

function messageParser(msg, src){
    let code = msg[0];
    switch(code){
        case MessageCode.Keep_Alive:
            keepAlive(msg.slice(1), src);
            break;
        case MessageCode.Info:
            info(msg.slice(1), src);
            break;
        case MessageCode.ChangedState:
            break;
    }
}

function keepAlive(msg, src){
    functions = [];
    for (let i = 8; i < msg.length; i++)
        functions.push(msg[i]);
    let newState = {
        cid: src,
        ip: `${msg[0]}.${msg[1]}.${msg[2]}.${msg[3]}`,
        ancestor: msg.readUInt32BE(4),
        functions: functions
    };
    agentModel.update({cid: src}, newState, (err,ar) => {
        if (err)
            console.error(err);
        else if (ar.n === 0)
            new agentModel(newState).save((err) => {
                if (err)
                    console.error(err);
            });
    });
}
function info(msg, src){
    let agent = agentModel.findOne({cid: src}).exec((err, agent) => {
        for(let i = 0; i < msg.length/6; i++){
            let number = msg[i*5];
            let key = msg[i * 5 + 1];
            let value = msg.readFloatBE(i * 5 + 2);
            agent.infos.push({number: number, agentKey: key, value: value, time: Date.now()});
        }
        agent.save((err) => {
            if (err)
                console.error(err);
        });
    });
}
function state(msg, src){
    let agent = agentModel.findOne({cid: src}).exec((err, agent) => {
        for(let i = 0; i < msg.length/5; i++){
            let number = msg[i * 5];
            let key = msg[i * 5 + 1];
            let value = msg.readFloatBE(i * 5 + 2);
            for (let j = 0; j < agent.states.length; i++)
                if (agent.states[j].agentKey === key && agent.states[j].number === number) {
                    agent.states[j].value = value;
                    break;
                }
        }
        agent.save((err) => {
            if (err)
                console.error(err);
        });
    });
}
function error(msg, src){
    let agent = agentModel.findOne({cid: src}).exec((err, agent) => {
        let code = msg[0];
        let cause = msg.slice(1).toString();
        agent.errors.push({errorCode: code, cause: cause, time: Date.now()});
        agent.save((err) => {
            if (err)
                console.error(err);
        });
    });
}

module.exports = messageParser;