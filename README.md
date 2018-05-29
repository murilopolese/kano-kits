# Kano Hardware

Node js modules for interacting with your favourite Kano kits!

## Kano Kits

The Kano Kits library offers a static method for you to list all the devices:

**Listing connected devices**

```js
const Kano = require('kano-kits');
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
});
```

It also expose the classes for `PixelKit` and `MotionSensor`:

```js
const Kano = require('kano-kits');
const PixelKit = Kano.PixelKit;
const MotionSensor = Kano.MotionSensor;
```

## Motion Sensor Kit (MSK)

You can get your Motion Sensor instance by listing all the connected devices
and filtering it "by instance" or create an instance straight from the serial
port path.

**Listing connected devices**

```js
const Kano = require('kano-kits');
const MotionSensor = Kano.MotionSensor;
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    let msk = devices.find((device) => {
        return device instanceof MotionSensor;
    });
    if (!msk) {
        console.log('No Motion Sensor Kit found');
        return;
    }
    // Use your `msk` here
})
.catch((error) => {
    console.log('error', error);
});
```

**Creating instance from serial port path**

```js
const MSK = require('kano-kits').MotionSensor;
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

You can get your Pixel Kit instance by listing all the connected devices
and filtering it "by instance" or create an instance straight from the serial
port path. You can also connect to your Pixel Kit over wifi if it's connected
to the same network as your computer and you know the ip address (more on this
further down!). You can access all the methods the same way over serial or ip.

**Listing connected devices**

```js
const Kano = require('kano-kits');
const PixelKit = Kano.PixelKit;
Kano.listConnectedDevices()
.then((devices) => {
    console.log(devices.length, 'devices found');
    let pk = devices.find((device) => {
        return device instanceof PixelKit;
    });
    if (!pk) {
        console.log('No Pixel Kit found');
        return;
    }
    // Use `pk` here
})
.catch((error) => {
    console.log('error', error);
});
```

**Creating instance from serial port path**

```js
const PixelKit = require('kano-kits').PixelKit;
let myPK = new PixelKit({path: '/dev/ttyUSB0'});
myPK.connect()
.then((pk) => {
    console.log('my Pixel Kit is connected');
    // Use `pk` here
});
```

**Creating instance from ip address**

```js
const PixelKit = require('kano-kits').PixelKit;
let myPK = new PixelKit({ip: '192.168.0.24'});
myPK.connect()
    .then((pk) => {
        console.log('my Pixel Kit is connected');
        // Use `pk` here
    });
```

### `getDeviceInfo()`

Requests the current device information.

```js
pk.getDeviceInfo()
    .then((data) => {
        if (data.error) {
            console.log('Something went wrong', data.error);
        } else {
            console.log('Device info', data.value);
        }
    });
```

### `streamFrame(frame)`


### `setName(name)`

You can set a name for your Pixel Kit, although the only places where you can
query this information is by using Kano Code or calling `getName()`.

```js
pk.setName('My Pixel Kit')
    .then((data) => {
        if (data.error) {
            console.log('Something went wrong', data.error);
        }
    });
```

### `getName()`

Get your Pixel Kit name.

```js
pk.getName()
    .then((data) => {
        if (data.error) {
            console.log('Something went wrong', data.error);
        } else {
            console.log('Your Pixel Kit name is', data.value);
        }
    });
```

### `getBatteryStatus()`

Get your battery status. The result will contain two values:

- `status`: It will be `Charging` or `Discharging`.
- `percent`: A number between `0` and `100` that represents your battery level.

```js
pk.getBatteryStatus()
    .then((data) => {
        if (data.error) {
            console.log('Something went wrong', data.error);
        } else {
            console.log('Your Pixel Kit battery status is', data.value);
        }
    });
```

### `getWifiStatus()`

Request the current wifi status on the Pixel Kit. The status object will look
something like this if it's connected:

```json
{
    "ssid": "Kano Network",
    "mac_address": "30AEA40AFF99",
    "ip": "192.168.0.2",
    "port": "9998",
    "netmask": "255.255.255.0",
    "gateway": "192.168.0.1",
    "connected": true,
    "signal": 85
}
```

And something like this if it's not connected:

```json
{
    "ssid": "Kano Network",
    "mac_address": "30AEA40AFF99",
    "ip": "0.0.0.0",
    "port": "9998",
    "netmask": "0.0.0.0",
    "gateway": "0.0.0.0",
    "connected": false
}
```

```js
rpk.getWifiStatus()
    .then((data) => {
        console.log('Wifi status', data.value);    
    })
```

### `scanWifi()`

Before you connect to a network you might want to check what are the networks
are visible to the Pixel Kit. `scanWifi()` resolves a promise with an array of
networks that looks like this:

```json
[
    { "ssid": "Kano Network", "signal": 89, "security": 3 },
    { "ssid": "Another Network", "signal": 75, "security": 3 },
    { "ssid": "Neighbor Network", "signal": 42, "security": 3 }
]
```

```js
rpk.scanWifi()
    .then((data) => {
        console.log('Those are the available wifi', data.value);
    });
```

### `connectToWifi(ssid, password)`

This method connects to a wifi and return a promise that resolves with an object
similar to the one from `getWifiStatus()` (or an error):

```json
{
    "ssid": "Kano Network",
    "mac_address": "30AEA40AFF99",
    "ip": "192.168.0.2",
    "port": "9998",
    "netmask": "255.255.255.0",
    "gateway": "192.168.0.1",
    "connected": true,
    "signal": 85
}
```

```js
rpk.connectToWifi('Kano Network', 'password')
    .then((data) => {
        console.log('Connected to wifi network', data.value);
    });
```

<!--
### `getLastWifiError()`
### `playTone(freq, duration)`
### `isPlayingTone()`
### `stopTone()`
### `getMicThreshold()`
### `setMicThreshold(level, min, max)`
### `getAnimationConfig(modeId)`
### `setAnimationConfig(name, modeId, frameCount, frameRate, coverUrl)`
### `getMaxFrames()`
### `eraseAnimation(modeId)`
### `saveAnimationFrame(modeId, frameNumber, frame)`
-->
