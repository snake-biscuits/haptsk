from __future__ import annotations
import socket
from typing import Dict, List, Tuple


AddressPair = Tuple[str, int]
# ^ ("ip.address", port)


def contents_of(filename: str) -> str:
    """get the contents of a UTF-8 text file for caching"""
    with open(filename) as file:
        return file.read()


# TODO: adapt into a Page object
# -- (method, route, protocol) -> (protocol, code, code_name)
class Request:
    method: str
    route: str
    header: Dict[str, str]
    body: str
    # properties
    form: Dict[str, str]

    def __init__(self, method="GET", route="/", header=dict(), body=""):
        self.method = method
        self.route = route
        self.header = header
        self.body = body

    def __repr__(self) -> str:
        return f"<Request {self.method} {self.route} @ 0x{id(self):016X}>"

    @property
    def form(self) -> Dict[str, str]:
        """POST body -> dict (for html forms)"""
        return dict([
            pair.split("=")
            for pair in self.body.lstrip("/?").split("&")])

    @classmethod
    def from_str(cls, request: str) -> Request:
        raw_header, body = request.split("\r\n\r\n")
        header_lines = raw_header.split("\r\n")
        method, route, protocol = header_lines[0].split()
        assert protocol == "HTTP/1.1"
        header = dict([
            line.split(": ")
            for line in header_lines[0:-1]])
        return cls(method, route, header, body)

    @classmethod
    def from_bytes(cls, raw_data: bytes) -> Request:
        return cls.from_str(raw_data.decode())

    @classmethod
    def from_socket(cls, socket_: socket.socket) -> Request:
        out = cls.from_bytes(socket_.recv(0x8000))
        length = int(out.header.get("Content-Length", 0x8000))
        if length > 0x8000:
            tail = socket_.recv(length - 0x8000)
            out.body += tail.decode()
        return out


class Client:
    socket: socket.socket
    address: AddressPair
    ip: str = property(lambda s: s.address[0])
    port: str = property(lambda s: s.address[2])

    def __init__(self, socket_=None, address=("", 0)):
        self.socket = socket_
        self.address = address

    def __repr__(self) -> str:
        return f"<Client @ {self.ip}:{self.port}>"

    def receive(self) -> Request:
        return Request.from_socket(self.socket)

    def send(self, message: List[str]):
        self.socket.send("\r\n".join(message).encode())


class Server:
    address: AddressPair
    clients: List[Client]
    # cached assets
    static: Dict[str, Tuple[str, str]]
    # ^ {"route": ("mime/type", "body")}
    # TODO:
    # -- generators: Dict[str, Any]
    # -- ^ {"pattern": page_generator(route) -> ("mime/type", "body")}
    # properties
    ip: str = property(lambda s: s.address[0])
    port: int = property(lambda s: s.address[1])

    def __init__(self, ip: str, port: int):
        self.address = (ip, port)
        self.clients = list()
        self.static = dict()
        # self.generators = dict()

    def __repr__(self) -> str:
        descriptor = f"w/ {len(self.clients)} clients"
        return f"<Server {descriptor} @ {self.ip}:{self.port}>"

    def reply(self, client):
        """parse & respond to client request"""
        request = client.receive()
        if request.method == "GET":
            self.reply_to_GET(client, request)
        elif request.method == "POST":
            self.reply_to_POST(client, request)
        else:
            raise NotImplementedError(
                f"unsupported HTTP method: '{request.method}'")

    # HTTP methods
    def reply_to_GET(self, client: Client, request: Request):
        if request.route in self.static:
            mime_type, body = self.static[request.route]
            self.serve_200(client, mime_type, body)
            print(f"> served static route '{request.route}'")
        # TODO: dynamic route generators
        else:
            self.serve_404(client, request.route)

    def reply_to_POST(self, client: Client, request: Request):
        raise NotImplementedError("have no response to POST")

    # HTTP responses
    def serve_200(self, client: Client, mime_type: str, data: str):
        """open a file in the browser"""
        client.send([
            "HTTP/1.1 200 OK",
            f"Content-Type: {mime_type}; charset=UTF-8",
            f"Content-Length: {len(data)}",
            "Connection: close",
            "",
            data])

    def serve_303(self, client: Client, route: str):
        """redirect to another page"""
        url = f"http://{self.ip}:{self.port}{route}"
        client.send([
            "HTTP/1.1 303 See Other",
            f"Location: {url}",
            "Content-Type: text/html; charset=UTF-8",
            "Content-Length: 0",
            ""])
        print(f"~ redirected to {route}")

    def serve_404(self, client: Client, route: str):
        """FileNotFound"""
        # TODO: if "/404" in self.static -> serve
        client.serve([
            "HTTP/1.1 404 Not Found",
            ""])
        print(f"! file not found '{route}'")

    def serve_500(self, client: Client):
        """RuntimeError"""
        # TODO: if "/500" in self.static -> serve
        client.serve([
            "HTTP/1.1 500 Internal Server Error",
            ""])
        print("! server error")

    def serve_501(self, client: Client):
        """NotImplementedError"""
        # TODO: if "/501" in self.static -> serve
        client.serve([
            "HTTP/1.1 501 Not Implemented",
            ""])
        print("! not implemented")

    def run(self):
        """main function"""
        # NOTE: synchronous, should only be one user at a time anyway
        # TODO: async: scan for new clients while responing to current ones
        with socket.create_server((self.ip, self.port)) as server:
            print(f"@ server is live: http://{self.ip}:{self.port}/")
            while True:
                print("^ listening for a client")
                client = server.accept()
                print(f"= connected to {client}")
                # TODO: respect "Connection: keep-alive"
                # -- manage a list of clients
                # -- need some kind of timeout
                try:
                    self.reply(client)
                except NotImplementedError:
                    self.serve_501(client)
                except Exception as exc:
                    self.serve_500(client)
                    raise exc
                client.socket.close()
                print("v connection closed")


if __name__ == "__main__":
    server = Server("0.0.0.0", 8000)
    server.run()
