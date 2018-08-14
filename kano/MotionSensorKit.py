from kano.msk import MSK

class MotionSensorKit(MSK):

    def __init__(self, port=None):
        super().__init__(port)

    def on_event(self, data):
        if data['name'] == 'proximity-data':
            self.on_proximity(data['detail']['proximity'])

    def change_mode(self, mode='proximity'):
        if mode == 'proximity' or mode == 'gesture':
            self.set_mode(mode)
        else:
            print('mode not recognized')

    def on_proximity(self, proximity):
        pass

    def on_gesture(self, gesture):
        pass
