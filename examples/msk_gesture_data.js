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
    // msk.on('data', (data) => console.log(data));
    return msk.setMode('gesture')
        .then((data) => {
            console.log('msk is on gesture mode');
            msk.on('gesture', (data) => {
                console.log('gesture', data);
            });
        });
})
.catch((error) => {
    console.log('error', error);
});
