const Kano = require('../kano-kits.js');
const PixelKit = Kano.PixelKit;

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
    return rpk.scanWifi()
        .then((data) => {
            console.log('Those are the available wifi', data.value);
        });
})
.catch((error) => {
    console.log('error', error.message);
});
