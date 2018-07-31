import serial
import threading
import json
from time import sleep

class SerialConnection():
	port = None
	thread = None
	connection = None
	def __init__(self, port):
		self.port = port
		
	def open(self):
		self.connection = serial.Serial(
			port=self.port,
			baudrate=115200
		)
		self.connection.dtr = True
		if not self.connection.isOpen():
			self.connection.open()
		else:
			self.connection.close()
			self.connection.open()
		sleep(0.1)
		
		self.thread = threading.Thread(target=self.read)
		self.thread.start()
	
	def close(self):
		self.connection.close()
		self.thread.stop()
	
	def read(self):
		while True:
			sleep(0.03)
			if self.connection.isOpen():
				msg = self.connection.readline()
				if type(msg) == bytes:
					data = json.loads(msg.decode())
				else:
					data = json.loads(msg)
				self.on_data(data)
			else:
				msg = ('Cannot connect to device')
				raise IOError(msg)
	
	def write(self, data):
		self.connection.write(data.encode('utf-8'))
		self.connection.flush()
		sleep(0.03)
	
	def on_data(self, data):
		pass
