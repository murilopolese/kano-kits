const PixelKit = require('../kano-kits.js').PixelKit;
const rpk = new PixelKit({ip: '10.0.30.65'});

rpk.connect()
.then((rpk) => {
    // rpk.on('data', (d) => console.log('data', d))
    rpk.getBatteryStatus()
        .then((data) => {
            console.log('Battery status', data.value);
        })
})
.catch((error) => {
    console.log('error', error);
});
