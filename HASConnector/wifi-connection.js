/**
 * Created by tahae on 7/6/2017.
 */
const WiFiControl = require('wifi-control');
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

function findAndConnect(cb){ //cb should send keepalive, takes target ip as argument
    console.log('scanning for wifi...');
    WiFiControl.resetWiFi( function(err, response) {
    if (err) console.log(err);
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
                console.log(response.msg + '\nsending keep-alive');
                cb('192.168.4.1'); //TODO should this be dynamic?
            }
        });
    });
  } );

}

function initialize(keepAliveCB){
    findAndConnect(keepAliveCB);
    setInterval(() => {findAndConnect(keepAliveCB)}, 20*1000);
}

module.exports = initialize;
