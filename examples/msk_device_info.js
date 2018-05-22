const Kano = require('../kano-kits.js');
const MotionSensor = require('../msk.js');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    if (devices.length == 0 || !(devices[0] instanceof MotionSensor)) {
        console.log('No Motion Sensor Kit found');
        return;
    }
    msk = devices[0];
    msk.getDeviceInfo()
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
