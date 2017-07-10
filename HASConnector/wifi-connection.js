/**
 * Created by tahae on 7/6/2017.
 */
const WiFiControl = require('wifi-control');
const os = require('os');
WiFiControl.init({debug: false, connectionTimeout: 20000});

const ssidPrefix = 'ArcMesh';
const password = 'tahamesh';

function signalComparator(a, b){
    if (a.signal_level > b.signal_level)
        return -1;
    if (a.signal_level === b.signal_level)
        return 0;
    return 1;
}

function wifiFilter(a){
    return a.ssid.startsWith(ssidPrefix);
}

let connectionCounter = 0;

let gatewayIp = '';

function findAndConnect(cb){ //cb should send keepalive, takes target ip as argument
    if (WiFiControl.getIfaceState().connection !== 'connected'){
        console.log('scanning for wifi...');
        WiFiControl.scanForWiFi((err, response) => {
            if (err) console.error(err);
            let networks = response.networks.filter(wifiFilter).sort(signalComparator);
            if (networks.length === 0) {
                console.log(`no ${ssidPrefix} found`);
                return;
            }
            let selected_network = networks[0];
            console.log(`connecting to ${selected_network.ssid}...`);
            WiFiControl.connectToAP({ssid: selected_network.ssid, password: password}, (err, response) => {
                if (err) console.error(err);
                if (response.success === true){
                    let ip = os.networkInterfaces().wlan0[0].address.split('.');
                    ip[3] = 1;
                    gatewayIp = ip.join('.');
                    console.log(response.msg + '\nsending keep-alive\n gateway ip: ' + gatewayIp);
                    cb(gatewayIp); //TODO should this be dynamic?
                }
                if (connectionCounter++ % 10 === 5)
                    WiFiControl.resetWiFi( function(err, response) {
                        if (err) console.log(err);
                        console.log(response);
                    } );
            });
        });
    } else {
        console.log('sending keep alive');
        cb(gatewayIp); //TODO should this be dynamic?
    }
}

function initialize(keepAliveCB){
    findAndConnect(keepAliveCB);
    setInterval(() => {findAndConnect(keepAliveCB)}, 20*1000);
}

module.exports = initialize;
