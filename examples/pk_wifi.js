const Kano = require('../kano-kits.js');
const PixelKit = require('../rpk.js');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    let rpk = devices.find((device) => {
        return device instanceof PixelKit;
    });
    if (!rpk) {
        console.log('No Pixel Kit found');
        return;
    }
    // rpk.on('data', (d) => console.log('data', d))
    return rpk.getWifiStatus()
        .then((data) => {
            console.log('Wifi status', data.value);
            return rpk.getLastWifiError()
        })
        .then((data) => {
            console.log('Last wifi error', data);
            return rpk.scanWifi();
        })
        .then((data) => {
            console.log('Those are the available wifi', data.value);
            return rpk.connectToWifi('Kano Legacy', 'XXX');
        })
        .then((data) => {
            console.log('Connected to wifi network', data.value);
            return rpk.getWifiStatus();
        });
})
.catch((error) => {
    console.log('error', error);
});
