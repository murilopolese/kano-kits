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
    rpk.getBatteryStatus()
        .then((data) => {
            console.log('Battery status', data.value);
        })
})
.catch((error) => {
    console.log('error', error);
});
