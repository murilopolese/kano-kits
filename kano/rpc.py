import uuid
import json
from promise import Promise

class RPC():
	connection = None
	promises = {}
	def __init__(self, connection):
		if connection:
			self.connection = connection
		else:
			raise ValueError('connection must be provided')
			
	def on_data(self, data):
		if data['type'] == 'rpc-response' and data['err'] == 0:
			rId = data['id']
			if rId in self.promises.keys() and 'value' in data.keys():
				self.promises[rId]['resolve'](data['value'])
				self.promises.pop(rId, None)
		elif data['type'] == 'rpc-response' and data['err'] != 0:
			self.on_error(data)
	
	def on_error(self, data):
		print('error', data)
	
	def open(self):
		self.connection.on_data = self.on_data
		self.connection.open()
	
	def get_request_object(self, method, params=[]):
		return {
			'type': 'rpc-request',
			'id': str(uuid.uuid4()),
			'method': method,
			'params': params
		}
	
	def get_request_string(self, request_object):
		request_string = json.dumps(
			request_object, separators=(',', ':')
		)
		return request_string + '\r\n'

	def request(self, method, params):
		request_object = self.get_request_object(method, params)
		request_id = request_object['id']
		request_string = self.get_request_string(request_object)
		def resolver(resolve, reject):
			self.promises[request_id] = {
				'resolve': resolve,
				'reject': reject
			}
			self.connection.write(request_string)
		return Promise(resolver)
		
