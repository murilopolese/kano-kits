# Kano Hardware

Node js modules for interacting with your favourite Kano kits!

## Motion Sensor Kit (MSK)

You can get your Motion Sensor instance by listing all the connected devices
and filtering it "by instance" or create an instance straight from the serial
port path.

**Listing connected devices**

```js
const Kano = require('kano-kits');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
});
```

**Creating instance from serial port path**

```js
const MSK = require('kano-kits/msk');
let myMsk = new MSK({path: '/dev/ttyUSB0'});
myMsk.connect()
.then((msk) => {
    console.log('my msk connected');
});
```

Once you have the instance of your Motion Sensor, you can call the following
methods:

### `setMode(mode)`

Set the Motion Sensor mode. The available modes are `proximity` and `gesture`.

In `proximity` mode the board will output the current distance between any
object and the Motion Sensor as a constant stream of data (the interval can be
set with `setInterval`). The minimum value for `proximity` is `0` and the
maximum is `255`. **Every time your Motion Sensor is unplugged from your
computer it resets to `proximity` mode**.

In `gesture` mode the board will output what was the last gesture the sensor
detected. This information will not be a stream of information but a one off
event. The values for the `gesture` can be `up`, `down`, `left` or `right`.

You can subscribe to `proximity` and `gesture` events with `on(event, handler)`.

```js
msk.setMode('proximity')
.then((data) => {
    if (data.error) {
        console.log('Something went wrong', data.error);
    } else {
        console.log('MSK is on proximity mode now');
    }
});
```

### `setInterval(interval)`

Set the interval the board request data from the hardware sensor. Interval must be a number and it's in milliseconds.

```js
msk.setInterval(200)
.then((data) => {
    if (data.error) {
        console.log('Something went wrong', data.error);
    } else {
        console.log('MSK is polling data from the sensor every 200ms');
    }
});
```

### `getDeviceInfo()`

Requests the current device information.

```js
msk.getDeviceInfo()
.then((data) => {
    if (data.error) {
        console.log('Something went wrong', data.error);
    } else {
        console.log('Device info', data.value);
    }
});
```

### `on(event, handler)`

Attaches a handler to an event fired by the instance. The events you should
care to subscribe are:

- `proximity`
- `gesture`
- `error-message`
- `data`

```js
msk.setMode('proximity')
.then((data) => {
    if (data.error) {
        console.log('Something went wrong', data.error);
    } else {
        console.log('MSK is on proximity mode now');
        msk.on('proximity', (proximity) => {
            console.log('proximity is', proximity);
        });
    }
});
```

## Pixel Kit (KPK and RPK)

Coming...
