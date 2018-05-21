const SerialPort = require('serialport');
const EventEmitter = require('events');

let listConnectedDevices = () => {
    return SerialPort.list()
        .then((ports) => {
            return new Promise((resolve, reject) => {
                let serialPorts = ports.filter((port) => {
                    return port.vendorId === '2341';
                });
                let mskPorts = serialPorts.map((port) => {
                    return new SerialPort(port.comName, {
                        baudRate: 115200,
                        autoOpen: false
                    });
                });
                resolve(mskPorts);
            });
        })
        .then((mskPorts) => {
            let emitters = mskPorts.map((msk) => {
                return new Promise(function(resolve, reject) {
                    let emitter = new EventEmitter();
                    msk.on('data', (d) => {
                        try {
                            let data = JSON.parse(d.toString());
                            emitter.emit('data', data);
                            if (data.type == 'event' && data.name == 'proximity-data') {
                                emitter.emit('proximity', data.detail.proximity);
                            }
                            if (data.type == 'event' && data.name == 'gesture') {
                                emitter.emit('gesture', data.detail.type);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                    msk.on('open', () => {
                        emitter.on('write', (data) => {
                            msk.write(Buffer.from(data));
                        });
                        emitter.on('set-mode', (mode) => {
                            let request = {
                                type: "rpc-request",
                                id: `id${parseInt(Math.random()*9999)}`,
                                method: 'set-mode',
                                params: [{ mode: mode }]
                            };
                            emitter.emit('write', JSON.stringify(request)+'\r\n');
                        });
                        emitter.on('set-interval', (interval) => {
                            let request = {
                                type: "rpc-request",
                                id: `id${parseInt(Math.random()*9999)}`,
                                method: 'set-interval',
                                params: [{ interval: interval }]
                            };
                            emitter.emit('write', JSON.stringify(request)+'\r\n');
                        });
                        emitter.on('device-info', () => {
                            let request = {
                                type: "rpc-request",
                                id: `id${parseInt(Math.random()*9999)}`,
                                method: 'device-info',
                                params: []
                            };
                            emitter.emit('write', JSON.stringify(request)+'\r\n');
                        })
                        resolve(emitter);
                    });
                    msk.open();
                });
            });
            return Promise.all(emitters)
        })
}

module.exports = {
    listConnectedDevices: listConnectedDevices
}












// .then((ports) => {
//     let emitters = [];
//     ports.forEach((port) => {
//         let emitter = new EventEmitter();
//         port.on('open', (err) => {
//             if (err) {
//                 reject(err);
//             }
//         });
//         port.on('data', (d) => {
//             let data = {};
//             try {
//                 data = JSON.parse(d.toString());
//                 emitter.emit('data', data);
//                 if(data.type == 'event') {
//                     if (data.name == 'proximity-data') {
//                         emitter.emit('proximity', data.detail.proximity);
//                     }
//                 }
//             } catch (e) {
//                 reject(e);
//             }
//         });
//         port.open((err) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(emitter);
//         });
//         emitters.push(emitter);
//     })
//     return Promise.resolve(emitters)
// });
