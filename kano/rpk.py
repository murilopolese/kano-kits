from kano.serialconnection import SerialConnection
from kano.rpc import RPC
from base64 import b64encode
from binascii import unhexlify

class PixelKit():
	connection = None
	rpc = None
	
	def __init__(self, port=None, ip=None):
		if port:
			self.connection = SerialConnection(port)
		elif ip:
			print('connect over websocket')
		else:
			raise ValueError('port or ip must be provided')

		self.rpc = RPC(self.connection)
		self.rpc.open()
	
	def hexToBase64(self, colors):
		result = ''
		lalala = []
		for color in colors:
			rgb888 = int('0x{0}'.format(color[1:]), 16)
			rgb565 = (rgb888 & 0xF8) >> 3 | (rgb888 & 0xFC00) >> 5 | (rgb888 & 0xF80000) >> 8
			lalala.append(rgb565>>8)
			lalala.append(rgb565&0xff)
		result = b64encode(bytes(lalala))
		return result.decode()
	
	def get_device_info(self):
		return self.rpc.request('device-info')

	def stream_frame(self, frame):
		'''
		{"id":"4706406a-3c2e-4b48-b774-19c92cfc886b","method":"grid-bmp","params":[{"map":"/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w=="}],"type":"rpc-request"}
		
		{"method":"lightboard:on","type":"rpc-request","id":"3642ec9e-82d4-48ea-9b2f-2c0938d49add","params":[{"map":"////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"}]}

		'''
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
