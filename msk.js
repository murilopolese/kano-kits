const SerialPort = require('serialport');
const EventEmitter = require('events');
const rpcRequestObject = require('./rpc.js').rpcRequestObject;
const rpcPromise = require('./rpc.js').rpcPromise;

class MotionSensor extends EventEmitter {
    /**
     * Constructor for Motion Sensor class
     *
     * @param {Object} options Options for Motion Sensor class. It should
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
    }
    /**
     * Binds events from serial port to internal event emitter (bus) and from
     * the event emitter to the serial port.
     */
    bindEvents() {
        // Handles everything the serial port sends.
        this.port.on('data', (d) => {
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
                // Proxy the `rpc-response` from serial connection to internal
                // event emitter.
                if(data.type == 'rpc-response') {
                    this.emit('rpc-response', data);
                }
            } catch (e) {
                console.log('error', e.message);
            }
        });

        // Print error messages
        // this.on('error-message', (msg) => {
        //     console.log('error message:', msg);
        // })

        // Writes/sends something to the serial port
        this.on('send', (data) => {
            this.port.write(Buffer.from(data));
        });
        // Stringify data object and write it to the serial port
        this.on('rpc-request', (data) => {
            this.send(JSON.stringify(data)+'\r\n');
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
     * Sends data to serial port.
     *
     * @param {String} data String data to be sent over to serial port.
     */
    send(data) {
        this.emit('send', data);
    }
    /**
     * Sends an RPC request to device calling for a `method` passing `params`.
     *
     * @param {String} method Which RPC method to call on the board.
     * @param {Array} params Parameters for the current method.
     * @return {Promise}
     */
    rpcRequest(method, params) {
        let requestObject = rpcRequestObject(method, params);
        return rpcPromise(requestObject, this);
    }
    /**
     * Sends an RPC request to set the MSK mode.
     *
     * @param {String} mode Mode to set on the MSK. It could be either
     *      `proximity` or `gesture`.
     * @return {Promise}
     */
    setMode(mode) {
        return this.rpcRequest('set-mode', [{mode: mode}]);
    }
    /**
     * Sends an RPC request to set the MSK data polling interval.
     *
     * @param {Number} inteval How often should the MSK ask the hardware sensor
     *      for information (in milliseconds).
     * @return {Promise}
     */
    setInterval(interval) {
        return this.rpcRequest('set-interval', [{interval: interval}]);
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

module.exports = MotionSensor
