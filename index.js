const WebSocket = require('ws');
const { printc, print } = require('better-node-print');

class EasyWSS {

    server;
    fs = {
        onconnection: () => {},
        onclose: () => {},
        onmessage: () => {}
    };

    /**
     * @param {any?} options
     */
    constructor(options) {
        this.server = new WebSocket.Server(options);

        this.server.on('connection', (socket, req) => {

            let ipAddress = req.socket.remoteAddress || "?";
            if(ipAddress.startsWith('::ffff:')) {
                ipAddress = ipAddress.split('::ffff:')[1];
            }
            socket.remoteAddress = ipAddress;
            socket.remotePort = req.socket.remotePort;

            printc([
                { text: "Verbindung hergestellt mit " },
                { text: ipAddress, color: "yellow" },
                { text: "." }
            ]);

            socket.on('message', (message) => {
                const msg = JSON.parse(message.toString());
                switch (msg.type) {
                    case "m":
                        this.fs.onmessage(socket, msg.value);
                }
            });
        
            socket.on('close', (code, reason) => {
                printc([
                    { text: "Verbindung geschlossen mit ", color: "red" },
                    { text: ipAddress, color: "yellow" },
                    { text: ". ", color: "red" },
                    { text: `(${code}${reason != "" ? ': ' + reason : ""})`, color: "gray" }
                ]);

                this.fs.onclose(socket, code, reason);
            });

            this.fs.onconnection(socket);
        });

        printc([
            { text: "WebSocket-Server läuft auf Port: " },
            { text: this.server.address().port, color: "magenta"}
        ]);
    }
    
    send = function(socket, msg) {
        socket.send(JSON.stringify({type:"m", value: msg}));
    }
    sendAll = function(msg) {
        this.server.clients.forEach(socket => {
            socket.send(JSON.stringify({type:"m", value: msg}));
        });
    }

    sendCustom = function(socket, msg) {
        socket.send(JSON.stringify(msg));
    }
    sendAllCustom = function(msg) {
        this.server.clients.forEach(socket => {
            socket.send(JSON.stringify(msg));
        });
    }

    disconnectAll = function(code) {
        this.sendAllCustom({type: "please-disconnect", value: code});

        print("Disconnected all Clients.", "red");
    }

    on = function(type, listener) {
        switch (type) {
            case "open":
                this.fs.onopen = listener;
                break;
            case "close":
                this.fs.onclose = listener;
                break;
            case "message":
                this.fs.onmessage = listener;
                break;
            default:
                break;
        }
    }
}

module.exports = EasyWSS;
