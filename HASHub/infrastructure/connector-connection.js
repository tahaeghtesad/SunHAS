/**
 * Created by tahae on 6/29/2017.
 */
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const model = require('../model/models');

module.exports = {
    setState: (chip, actuator, value) => {
        let buffer = Buffer.alloc(14);
        buffer.writeInt32BE(chip, 0);
        buffer.writeInt32BE(0, 4);
        buffer[8] = model.MessageCode.SetState;
        buffer[9] = actuator;
        buffer.writeFloatBE(value, 10);
        server.send(buffer, 0, buffer.length, 7071, 'localhost');
    },
    setTime: (chip) => {
        let buffer = Buffer.alloc(13);
        buffer.writeInt32BE(chip, 0);
        buffer.writeInt32BE(0, 4);
        buffer[8] = model.MessageCode.Time;
        buffer.writeInt32BE(Math.floor(new Date() / 1000),9);
        server.send(buffer, 0, buffer.length, 7071, 'localhost');
    }
};