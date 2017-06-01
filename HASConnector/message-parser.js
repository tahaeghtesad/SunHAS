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
    let newState = {
        cid: src,
        ip: `${msg[0]}.${msg[1]}.${msg[2]}.${msg[3]}`,
        ancestor: msg.readUInt32BE(4),
        functions: msg.slice(8).toString('ascii').split(',') //TODO It is not comma separated anymore
    };
    agentModel.update({cid: src}, newState, (err,ar,rr) => {
        if (ar === 0)
            new agentModel(newState).save();
    });
}
function info(msg, src){
    let agent = agentModel.findOne({cid: src}).exec((err, agent) => {
        for(let i = 0; i < msg.length/5; i++){
            let key = msg[i*5];
            let value = msg.readFloatBE(i * 5 + 1);
            agent.infos.push({agentKey: key, value: value, time: Date.now()});
        }
        agent.save();
    });
}
function state(msg, src){

}
function error(msg, src){

}

module.exports = messageParser;