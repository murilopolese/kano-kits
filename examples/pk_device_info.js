const Kano = require('../kano-kits.js');
const PixelKit = require('../rpk.js');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    let rpk = devices.find((device) => {
        return device instanceof PixelKit;
    });
    if (!rpk) {
        console.log('No Motion Sensor Kit found');
        return;
    }
    // rpk.on('data', (d) => console.log('data', d))
    rpk.getDeviceInfo()
        .then((data) => {
            if (data.error) {
                console.log('something went wrong', data);
                throw new Error(data.error);
            }
            console.log('device info', data.value);
        });
})
.catch((error) => {
    console.log('error', error);
});
