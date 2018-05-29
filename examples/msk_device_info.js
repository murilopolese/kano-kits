const Kano = require('../kano-kits.js');
const MotionSensor = Kano.MotionSensor;

Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    let msk = devices.find((device) => {
        return device instanceof MotionSensor;
    });
    if (!msk) {
        console.log('No Motion Sensor Kit found');
        return;
    }
    return msk.getDeviceInfo()
        .then((data) => {
            console.log('device info', data.value);
        });
})
.catch((error) => {
    console.log('error', error);
});
