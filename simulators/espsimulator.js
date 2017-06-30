const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const chipId = getRandomInt(0, 2147483648);
const ancestorChipId = getRandomInt(0, 2147483648);
const IP = [];
IP[0] = getRandomInt(0,254);
IP[1] = getRandomInt(0,254);
IP[2] = getRandomInt(0,254);
IP[3] = getRandomInt(0,254);

console.log('chipId: ' + chipId);
console.log('ancestorChipId: ' + ancestorChipId);
console.log('ip: ' + IP[0] + '.' + IP[1] + '.' + IP[2] + '.' + IP[3]);

var count = 0;

setInterval(() => {

  let buffer = Buffer.alloc(21);
  buffer.writeInt32BE(0, 0);
  buffer.writeInt32BE(chipId, 4);
  buffer[8] = 1; // keepalive
  buffer[9] = IP[0];
  buffer[10] = IP[1];
  buffer[11] = IP[2];
  buffer[12] = IP[3];
  buffer.writeInt32BE(ancestorChipId, 13);
  buffer[17] = 1;
  buffer[18] = 1; //temperature
  buffer[19] = 2;
  buffer[20] = 4;
  // console.log(buffer);

  socket.send(buffer, 0, buffer.length, 8266, 'localhost');
  console.log('keepalive : ' + Date.now() + ' : ' + count++);
}, 5 * 1000);

var count2 = 0;
setTimeout(()=>{
  setInterval(()=>{
    let buffer = Buffer.alloc(14);
    buffer.writeInt32BE(0, 0);
    buffer.writeInt32BE(chipId, 4);
    buffer[8] = 3; // info
    if(count2%2){
      buffer[9]=1;
      buffer.writeFloatBE(getRandomArbitrary(18,28),10);
    } else {
      buffer[9]=2;
      buffer.writeFloatBE(getRandomArbitrary(0,100),10);
    }
    // console.log(buffer);

    socket.send(buffer, 0, buffer.length, 8266, 'localhost');
    console.log('info      : ' + Date.now() + ' : ' + count2++);
  }, 5 * 1000);
}, 2.5 * 1000);
