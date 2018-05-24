const MSK = require('../msk.js');
let myMsk = new MSK({path: '/dev/ttyUSB0'});
myMsk.connect()
.then((msk) => {
    console.log('my msk connected');
    return msk.setMode('gesture')
        .then((data) => {
            console.log('msk is on gesture mode');
            msk.on('gesture', (data) => {
                console.log('gesture', data);
            });
        })
})
.catch((error) => {
    console.log('error', error);
});
