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

	def open(self):
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

	def request(self, method, params=[]):
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
