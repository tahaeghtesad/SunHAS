/**
 * Created by tahae on 5/30/2017.
 */
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const espserver = dgram.createSocket('udp4');
const wifi = require('./wifi-connection');

const mongoose = require('./db-connection');

const messageParser = require('./message-parser');

const models = require('./models');
const logs = models.logModel;

server.on('message', (msg, rinfo) => {

    let target = msg.readUInt32BE(0);
    let sender = msg.readUInt32BE(4);
    let code = msg[8];
    let message = msg.slice(9);
    new logs({
        sender: sender,
        target: target,
        code: code,
        msg: message
    }).save();
    console.log(`server got: "${message}" from ${sender} to ${target}`);

    models.chipModel.findOne({cid: target}).exec((err, chip) => {
        if (err)
            console.error(err);
        else
            espserver.send(msg, 0, msg.length, 8266, chip.routerIp);
    });

});

server.on('listening', () => {
    const address = server.address();
    console.log(`conenctor server listening ${address.address}:${address.port}`);
});

espserver.on('listening', () => {
    const address = espserver.address();
    console.log(`esp server listening ${address.address}:${address.port}`);
});

espserver.on('message', (msg, rinfo) => {
    let target = msg.readUInt32BE(0);
    let sender = msg.readUInt32BE(4);
    let code = msg[8];
    let message = msg.slice(9);

    new logs({
        sender: sender,
        target: target,
        code: code,
        msg: message
    }).save();

    // console.log(`received: ${JSON.stringify({
    //     sender: sender,
    //     target: target,
    //     code: code,
    //     msg: message
    // }, null, 4)}`);

    messageParser(msg.slice(8), sender, rinfo.address);
});

function sendKeepAlive(ip) {
    let buffer = Buffer.alloc(9);
    buffer.writeInt32BE(-1, 0);
    buffer.writeInt32BE(0, 4);
    buffer[8] = models.MessageCode.Keep_Alive;

    espserver.send(buffer, 0, buffer.length, 8266, ip);
}

server.bind(7071);
espserver.bind(8266);

wifi(sendKeepAlive);