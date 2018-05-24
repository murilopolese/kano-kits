const SerialPort = require('serialport');
const createInterface = require('readline').createInterface;
const BaseRPCDevice = require('./base-rpc-device.js');

class PixelKit extends BaseRPCDevice {
    /**
     * Constructor for Motion Sensor class
     *
     * @param {Object} options Options for Pixek Kit class. It should
     *      contain at least a property with `path`.
     */
    constructor(options) {
        if (!options.path) {
            throw new Error('Path is required');
        }
        super();
        this.port = new SerialPort(options.path, {
            baudRate: 115200,
            autoOpen: false
        });
        this.lineReader = createInterface({
            input: this.port
        });
    }
    /**
     * Binds events from serial port to internal event emitter (bus) and from
     * the event emitter to the serial port.
     */
    bindEvents() {
        // Handles everything the serial port sends.
        // this.port.on('data', (d) => {
        this.lineReader.on('line', (d) => {
            try {
                // The data will come as a serialized/stringified json, therefore
                // we must parse it to get it's values.
                let data = JSON.parse(d.toString());
                // Proxy the `data` event to internal event emitter.
                this.emit('data', data);
                // Creates specific events on the internal event emitter based
                // on the `data` properties.
                if(data.type == 'event') {
                    switch (data.name) {
                        case 'error':
                            this.emit('error-message', data.detail.msg);
                            break;
                        default:
                    }
                }
            } catch (e) {
                this.emit('error-message', e.message)
            }
        });

        // Writes/sends something to the serial port
        this.on('send', (data) => {
            this.port.write(Buffer.from(data));
        });
    }
    /**
     * Opens the serial port and call `bindEvents`
     *
     * @return {Promise}
     */
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
    /**
     * Sends an RPC request to request the current MSK info. The promise should
     * resolve with an object with `vendor`, `product` and `mode` as properties.
     *
     * @return {Promise}
     */
    getDeviceInfo() {
        return this.rpcRequest('device-info', []);
    }
}

module.exports = PixelKit;
