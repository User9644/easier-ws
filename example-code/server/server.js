const EasyWSS = require('easier-ws');
const { printc } = require('better-node-print');

const server = new EasyWSS({port: 8080});

server.on("message", (socket, msg) => {
    printc([
        {text: socket.remoteAddress, color: "yellow"},
        {text: " send Message: "},
        {text: JSON.stringify(msg), color: "blue"}
    ]);
    server.sendAll(msg);

    if(msg.value == "!disconnect all")
        server.disconnectAll();
});
