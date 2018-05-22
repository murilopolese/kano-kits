const SerialPort = require('serialport');
const MotionSensor = require('./msk.js');

let listConnectedDevices = () => {
    return SerialPort.list()
    .then((ports) => {
        // TODO: Filter other devices than Motion Sensor
        let serialPorts = ports.filter((port) => {
            return port.vendorId === '2341';
        });
        let paths = serialPorts.map((port) => {
            return port.comName;
        });
        // TODO: Instantiate other devices than Motion Sensors
        let motionSensors = paths.map((path) => {
            let msk = new MotionSensor({path: path});
            return msk.connect();
        });
        return Promise.all(motionSensors);
    });
}

module.exports = {
    listConnectedDevices: listConnectedDevices
}
