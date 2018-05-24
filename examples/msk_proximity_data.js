const Kano = require('../kano-kits.js');
const MotionSensor = require('../msk.js');
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
    msk.setMode('proximity')
        .then((data) => {
            if (data.error) {
                console.log('something went wrong', data);
                throw new Error(data.error);
            }
            console.log('msk is on proximity mode');
            msk.on('proximity', (data) => {
                console.log('proximity', data);
            });
        });
    msk.on('data', (data) => {
        // All data msk is sending
        // console.log('on data', data);
    });
})
.catch((error) => {
    console.log('error', error);
});
