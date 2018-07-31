import ardurpc
from ardurpc.connector import Serial

con = Serial("/dev/tty.usbserial-DN049LCL", 115200)
rpc = ardurpc.ArduRPC(connector=con)

print("Version(Protocol): {0}".format(rpc.getProtocolVersion()))
print(
    "Version(Library): {0}".format(
        ".".join([str(i) for i in rpc.getLibraryVersion()])
    )
)
print(
    "Available handlers: {0}".format(
        ", ".join(rpc.get_handler_names())
    )
)
