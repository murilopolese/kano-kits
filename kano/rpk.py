from kano.serialconnection import SerialConnection
from kano.rpc import RPC
from base64 import b64encode
from binascii import unhexlify

class RPK():
	connection = None
	rpc = None

	def __init__(self, port=None, ip=None):
		if port:
			self.connection = SerialConnection(port)
			self.connection.on_data = self.on_data
		elif ip:
			print('connect over websocket')
		else:
			raise ValueError('port or ip must be provided')

		self.rpc = RPC(self.connection)
		self.rpc.open()

	def on_data(self, data):
		if data['type'] == 'rpc-response' and data['err'] == 0:
			rId = data['id']
			if rId in self.rpc.promises.keys() and 'value' in data.keys():
				self.rpc.promises[rId]['resolve'](data['value'])
				self.rpc.promises.pop(rId, None)
		elif data['type'] == 'rpc-response' and data['err'] != 0:
			self.on_error(data)
		elif data['type'] == 'event':
			self.on_event(data)

	def on_error(self, error):
		pass

	def on_event(self, event):
		pass

	def hexToBase64(self, hex_colors):
		int_colors = []
		for color in hex_colors:
			rgb888 = int('0x{0}'.format(color[1:]), 16)
			rgb565 = (rgb888 & 0xF8) >> 3 | (rgb888 & 0xFC00) >> 5 | (rgb888 & 0xF80000) >> 8
			int_colors.append(rgb565>>8)
			int_colors.append(rgb565&0xff)
		result = b64encode(bytes(int_colors))
		return result.decode()

	def get_device_info(self):
		return self.rpc.request('device-info')

	def stream_frame(self, frame):
		encoded_frame = self.hexToBase64(frame)
		return self.rpc.request(
			'lightboard:on',
			[{'map': encoded_frame}]
		)

	def set_name(self, name):
		return self.rpc.request('set-name', name)

	def get_name(self):
		return self.rpc.request('get-name')

	def get_battery_status(self):
		return self.rpc.request('battery-status')

	def get_wifi_status(self):
		return self.rpc.request('wifi-status')

	def scan_wifi(self):
		return self.rpc.request('wifi-scan')

	def get_last_wifi_error(self):
		return self.rpc.request('wifi-last-error')

	def connect_to_wifi(self, ssid, password):
		return self.rpc.request('wifi-connect', [ssid, password])

	def play_tone(self, freq, duration):
		return self.rpc.request(
			'play-tone',
			[{ 'freq': freq, 'duration': duration }]
		)

	def is_playing_tone(self):
		return self.rpc.request('is-playing-tone')

	def stop_tone(self):
		return self.rpc.request('stop-tone')

	def get_mic_threshold(self):
		return self.rpc.request('get-mic-threshold')

	def set_mic_threshold(self, level, minimum, maximum):
		if level == 'custom':
			return self.rpc.request(
				'set-mic-threshold',
				[{'level': level, 'min': minimum, 'max': maximum}]
			)
		else:
			return self.rpc.request(
				'set-mic-threshold',
				[{'level': level}]
			)
