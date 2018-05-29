/**
 * WARNING: The buzzer on Pixel Kit is EXTREMELY quiet so you probably won't
 * hear anything.
 */

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
    return rpk.playTone(100, 2000)
        .then((data) => {
            console.log('Playing tone', data);
            return rpk.isPlayingTone()
        })
        .then((data) => {
            console.log('Is it playing tone?', data.value.value['is-playing']);
            setTimeout(() => {
                rpk.stopTone()
                    .then(() => {
                        console.log('Tone stopped');
                    });
            }, 1000);
        })
})
.catch((error) => {
    console.log('error', error);
});
