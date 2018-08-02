from kano.rpk import RPK

class PixelKit(RPK):
    WIDTH = 16
    HEIGHT = 8
    buffer = []

    def __init__(self, port=None, ip=None):
        for i in range(0, 128):
            self.buffer.append([0, 0, 0])
        super().__init__(port, ip)

    def on_event(self, data):
        if data['name'] == 'button-up':
            if data['detail']['button-id'] == 'btn-A':
                self.onButtonA()
            elif data['detail']['button-id'] == 'btn-B':
                self.onButtonB()
            elif data['detail']['button-id'] == 'js-click':
                self.onJoystickClick()
            elif data['detail']['button-id'] == 'js-left':
                self.onJoystickLeft()
            elif data['detail']['button-id'] == 'js-right':
                self.onJoystickRight()
            elif data['detail']['button-id'] == 'js-up':
                self.onJoystickUp()
            elif data['detail']['button-id'] == 'js-down':
                self.onJoystickDown()
        if data['name'] == 'mode-change':
            if data['detail']['mode-id'] == 'offline-1':
                self.onDial(0)
            elif data['detail']['mode-id'] == 'offline-2':
                self.onDial(1)
            elif data['detail']['mode-id'] == 'online-p1':
                self.onDial(2)
            elif data['detail']['mode-id'] == 'online-p2':
                self.onDial(3)
            elif data['detail']['mode-id'] == 'online-p3':
                self.onDial(4)

    def onJoystickUp(self):
        pass
    def onJoystickDown(self):
        pass
    def onJoystickLeft(self):
        pass
    def onJoystickRight(self):
        pass
    def onJoystickClick(self):
        pass
    def onButtonA(self):
        pass
    def onButtonB(self):
        pass
    def onDial(self, dialValue):
        pass

    '''
    NeoPixel values are stored in a unidimensional array so to get `x` and `y`
    coordinates it's needed some math to break the values into rows
    '''
    def getIndexFromCoordinate(self, x, y):
        return (((y) * self.WIDTH) + (x)) % 128

    '''
    Set a pixel `color` on coordinates `x` and `y`. This will only set the value
    on the "buffer" and won't light any LED by itself. This operation is
    as fast as setting a value to an array
    '''
    def setPixel(self, x, y, color=[0, 200, 0]):
        index = self.getIndexFromCoordinate(x, y)
        self.buffer[index] = color

    '''
    Set the entire screen to a given color. This will only set the value on the
    "buffer" and won't light any LED by itself. This operation is as fast
    as setting a value to an array
    '''
    def setBackground(self, color=[200,200,0]):
        for i, c in enumerate(self.buffer):
            self.buffer[i] = color

    '''
    `setBackground` to black color (turn all the LED off)
    '''
    def clear(self):
        self.setBackground([0, 0, 0])

    def rgbToHex(self, color):
        return "#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2])

    '''
    Send the "buffer" values to the hardware. This operation is slower
    since it requires to send the information to the actual hardware and should be
    called as little as possible.
    '''
    def render(self):
        hex_buffer = []
        for color in self.buffer:
            hex_buffer.append(self.rgbToHex(color))
        self.stream_frame(hex_buffer)
