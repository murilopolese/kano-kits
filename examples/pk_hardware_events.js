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

    rpk.on('button-down', (data) => {
        console.log('button pressed', data);
    });
    rpk.on('button-up', (data) => {
        console.log('button released', data);
    });

    rpk.on('dial', (data) => {
        console.log('dial changed', data);
    });
})
.catch((error) => {
    console.log('error', error);
});
