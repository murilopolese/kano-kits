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
    // rpk.on('data', (d) => console.log('data', d))
    let rpkName = 'My Pixel Kit ' + parseInt(Math.random()*100);
    console.log('Setting Pixel Kit name to', rpkName);
    rpk.setName(rpkName)
        .then((data) => {
            return rpk.getName();
        })
        .then((data) => {
            console.log('Pixel kit name is set to', data.value.name);
        })
})
.catch((error) => {
    console.log('error', error);
});
