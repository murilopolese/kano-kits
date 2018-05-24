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
                        case 'button-down':
                            this.emit('button-down', data.detail['button-id']);
                            break;
                        case 'button-up':
                            this.emit('button-up', data.detail['button-id']);
                            break;
                        case 'mode-change':
                            this.emit('dial', data.detail['mode-id']);
                            break;
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

    hexToBase64Colors(element) {
        let frameBuffer = new Buffer(element.length * 2, 0);

        element.forEach((color, index) => {
            let colorBin = new Buffer(2),
                rgb888,
                rgb565;

            if (typeof color === "string" && color.length === 7 && /#[0-9a-f]{6}/i.test(color)) {
                rgb888 = parseInt(color.substring(1, 7), 16);
                //                blue                 green                  red
                rgb565 = (rgb888 & 0xF8) >> 3 | (rgb888 & 0xFC00) >> 5 | (rgb888 & 0xF80000) >> 8;

                colorBin.writeUInt16BE(rgb565, 0);
            } else {
                // If the color is invalid, write black
                colorBin.writeUInt16BE(0x0000, 0);
            }

            colorBin.copy(frameBuffer, index * 2);
        });
        return frameBuffer.toString('base64');
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

    // frame must be an array with 128 hexadecimal colors prefixed with a `#`
    streamFrame(frame) {
        let encodedFrame = this.hexToBase64Colors(frame);
        return this.rpcRequest('lightboard:on', [{ map: encodedFrame }]);
    }
    setName(name) {
        return this.rpcRequest('set-name', [name]);
    }
    getName() {
        return this.rpcRequest('get-name', []);
    }
    getBatteryStatus() {
        return this.rpcRequest('battery-status', []);
    }
    getWifiStatus() {
        return this.rpcRequest('wifi-status', []);
    }
    scanWifi() {
        return this.rpcRequest('wifi-scan', []);
    }
    getLastWifiError() {
        return this.rpcRequest('wifi-last-error', []);
    }
    connectToWifi(ssid, password) {
        return this.rpcRequest('wifi-connect', [ssid, password]);
    }

    playTone(freq, duration) {
        return this.rpcRequest('play-tone', [{ freq: freq, duration: duration }]);
    }
    isPlayingTone() {
        return this.rpcRequest('is-playing-tone', []);
    }
    stopTone() {
        return this.rpcRequest('stop-tone', []);
    }
    getMicThreshold() {
        return this.rpcRequest('get-mic-threshold', []);
    }
    // `level` can be `high`, `low` and `mid` or `custom`. If it's `custom`
    // it's expected to set a `min` and a `max`.
    setMicThreshold(level, min, max) {
        if(level == 'custom') {
            return this.rpcRequest('set-mic-threshold', [{
                level: level, min: min, max: max
            }]);
        }
        return this.rpcRequest('set-mic-threshold', [{ level: level }]);
    }

    // disableOTGControl() {}
    getAnimationConfig(modeId) {
        return this.rpcRequest('get-anim-config', [{ modeId: modeId }]);
    }
    setAnimationConfig(name, modeId, frameCount, frameRate, coverUrl) {
        return this.rpcRequest('set-anim-config', [{
            name: name,
            modeId: modeId,
            frameCount: frameCount,
            frameRate: frameRate,
            animImgUrl: coverUrl
        }]);
    }
    getMaxFrames() {
        return this.rpcRequest('get-max-frames', []);
    }
    eraseAnimation(modeId) {
        return this.rpcRequest('animation-erase', [{ modeId: modeId }]);
    }
    saveAnimationFrame(modeId, frameNumber, frame) {
        let encodedFrame = this.hexToBase64Colors(frame);
        return this.rpcRequest('animation-send-frame', [{
            modeId: modeId,
            frameNumber: frameNumber,
            map: encodedFrame
        }]);
    }
    // TODO: Save animation that writes the frames and save the config.
}

module.exports = PixelKit;
