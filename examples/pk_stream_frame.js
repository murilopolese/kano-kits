const Kano = require('../kano-kits.js');
const PixelKit = require('../rpk.js');
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
    // rpk.on('data', (d) => console.log('data', d));
    // rpk.on('error-message', (d) => console.log('error', d));

    setInterval(() => {
        let frame = [];
        for (let i = 0; i < 128; i++) {
            frame[i] = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        }
        rpk.streamFrame(frame)
            .catch((error) => {
                console.log('stream frame error', error.message);
            });
    }, 100);
})
.catch((error) => {
    console.log('error', error);
});
