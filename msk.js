const SerialPort = require('serialport');
const EventEmitter = require('events');
const rpcRequestObject = require('./rpc.js').rpcRequestObject;
const rpcPromise = require('./rpc.js').rpcPromise;

class MotionSensor extends EventEmitter {
    constructor(options) {
        super();
        this.port = new SerialPort(options.path, {
            baudRate: 115200,
            autoOpen: false
        });
    }
    bindEvents() {
        this.port.on('data', (d) => {
            try {
                let data = JSON.parse(d.toString());
                this.emit('data', data);
                if(data.type == 'event') {
                    switch (data.name) {
                        case 'proximity-data':
                            this.emit('proximity', data.detail.proximity);
                            break;
                        case 'gesture':
                            this.emit('gesture', data.detail.type);
                            break;
                        case 'error':
                            this.emit('error-message', data.detail.msg);
                            break;
                        default:
                    }
                }
                if(data.type == 'rpc-response') {
                    this.emit('rpc-response', data);
                }
            } catch (e) {
                console.log('error', e.message);
            }
        });
        // Print error messages
        this.on('error-message', (msg) => {
            console.log('error message:', msg);
        })
        // Writes something to the serial port
        this.on('write', (data) => {
            this.port.write(Buffer.from(data));
        });
        // Stringify data object and write it to the serial port
        this.on('rpc-request', (data) => {
            this.emit('write', JSON.stringify(data)+'\r\n');
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.port.on('open', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.bindEvents();
                resolve(this);
            });
            this.port.open();
        });
    }
    setMode(mode) {
        let requestObject = rpcRequestObject('set-mode', [{mode: mode}]);
        return rpcPromise(requestObject, this);
    }
    setInterval(interval) {
        let requestObject = rpcRequestObject('set-interval', [{interval: interval}]);
        return rpcPromise(requestObject, this);
    }
    getDeviceInfo() {
        let requestObject = rpcRequestObject('device-info', []);
        return rpcPromise(requestObject, this);
    }
}

module.exports = MotionSensor
