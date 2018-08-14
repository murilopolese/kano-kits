from kano.serialconnection import SerialConnection
from kano.rpc import RPC
from base64 import b64encode
from binascii import unhexlify

class MSK():
	connection = None
	rpc = None

	def __init__(self, port=None, ip=None):
		if port:
			self.connection = SerialConnection(port)
			self.connection.on_data = self.on_data
		else:
			raise ValueError('port must be provided')

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

	def set_mode(self, mode='proximity'):
		return self.rpc.request('set-mode', [{"mode": mode}])

	def set_interval(self, interval=100):
		return self.rpc.request('set-interval', [{"interval": interval}])

	def get_device_info(self):
		return self.rpc.request('device-info')
