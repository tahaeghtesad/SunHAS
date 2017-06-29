/**
 * Created by tahae on 6/29/2017.
 */
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

module.exports = {
    setState: (dst, actuator, key, value) => {},
    setTime: (dst, time) => {}
};