const Kano = require('../kano-kits.js');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
})
.catch((error) => {
    console.log('error', error);
});
