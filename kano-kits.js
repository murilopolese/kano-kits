const SerialPort = require('serialport');
const MotionSensor = require('./msk.js');
const PixelKit = require('./rpk.js');
const vendorIds = {
    '2341': 'msk',
    '0403': 'rpk'
};
/**
 * Request all the connected Kano devices. It resolves the promise with an array
 * of classes representing the connected devices and ready to use (no need to
 * connect or configure).
 *
 * @return {Promise}
 */
let listConnectedDevices = () => {
    return SerialPort.list()
    .then((ports) => {
        let deviceTypes = Object.keys(vendorIds);

        // Filter only ids that exist on the `vendorIds` dictionary
        let serialPorts = ports.filter((port) => {
            return vendorIds[port.vendorId];
        });

        let devicesPromise = serialPorts.map((port) => {
            switch(vendorIds[port.vendorId]) {
                case 'msk':
                    let msk = new MotionSensor({path: port.comName});
                    return msk.connect();
                    break;
                case 'rpk':
                    let rpk = new PixelKit({path: port.comName});
                    return rpk.connect();
                    break;
                default:
            }
        });
        return Promise.all(devicesPromise);
    });
}

module.exports = {
    listConnectedDevices: listConnectedDevices
}
