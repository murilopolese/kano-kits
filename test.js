const Kano = require('./kano-kits.js');

Kano.listConnectedDevices()
    .then((devices) => {
        console.log(devices.length+' device found');
        let msk = devices[0];

        msk.emit('set-mode', 'gesture');
        // msk.emit('device-info');
        // msk.on('data', (data) => {
        //     console.log('on data', data);
        // });
        msk.on('proximity', (data) => {
            console.log('proximity', data);
        });
        msk.on('gesture', (data) => {
            console.log('gesture', data);
        });
    })
