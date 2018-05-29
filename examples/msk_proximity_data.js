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
    msk.setMode('proximity')
        .then((data) => {
            console.log('msk is on proximity mode');
            msk.on('proximity', (data) => {
                console.log('proximity', data);
            });
        });
})
.catch((error) => {
    console.log('error', error);
});
