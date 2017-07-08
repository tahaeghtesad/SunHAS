const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.on('message', (data, rinfo) => {
  console.log(data);
});

socket.bind(8266);
