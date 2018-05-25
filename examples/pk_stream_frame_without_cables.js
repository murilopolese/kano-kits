const Kano = require('../kano-kits.js');
const PixelKit = require('../rpk.js');

const rpk = new PixelKit({ip: '10.0.30.65'});
rpk.connect()
    .then((data) => {
        console.log('hell yeah');
        // rpk.on('data', (data) => { console.log('data', data ) });
        // rpk.on('error-message', (data) => { console.log('error-message', data ) });
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
        console.log('error', error.message);
    })
