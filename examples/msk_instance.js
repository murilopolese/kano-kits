const MSK = require('../msk.js');
let myMsk = new MSK({path: '/dev/ttyUSB0'});
myMsk.connect()
.then((msk) => {
    console.log('my msk connected');
    msk.setMode('gesture')
    .then((data) => {
        if (data.error) {
            console.log('something went wrong', data);
            throw new Error(data.error);
        }
        console.log('msk is on gesture mode');
        msk.on('gesture', (data) => {
            console.log('gesture', data);
        });
    })
})
.catch((error) => {
    console.log('error', error);
});
