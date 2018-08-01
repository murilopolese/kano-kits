from kano.rpk import PixelKit

pk = PixelKit('/dev/tty.usbserial-DN049LCL')

pk.get_device_info().then(print)
