# easier-ws

[![Version npm](https://img.shields.io/npm/v/easier-ws.svg?logo=npm)](https://www.npmjs.com/package/easier-ws)

A Node.js package to make ws easier (definitely not).

## Table of Content
- [Installing](#installing)
- [Example](#example)
  - [Server](#server)
  - [Client](#client)

## Installing
```npm install easier-ws```

## Example

### Server

[**server.js**](example-code/server/server.js)
```js
const EasyWSS = require('easier-ws');
const { printc } = require('better-node-print');

const server = new EasyWSS({port: 8080});

server.on("message", (socket, msg) => {
    printc([
        {text: socket.remoteAddress, color: "yellow"},
        {text: " sendet Nachricht: "},
        {text: JSON.stringify(msg), color: "blue"}
    ]);
    server.sendAll(msg);

    if(msg.value == "!disconnect all")
        server.disconnectAll();
});
```

### Client

[**script.js**](example-code/client/script.js)
```js
let ws;
let e = {};

document.addEventListener('DOMContentLoaded', ev => {
    for (let i in document.body.children) {
        if(document.body.children[i].id) e[document.body.children[i].id] = document.body.children[i];
    }

    ws = new EasierWS(e.ws.value);

    ws.on("connecting", ev => {
        e.status.innerText = "Connecting ...";
        e.connectButton.disabled = true;
        e.connectButton.innerHTML = "Disconnect";
    });

    ws.on("open", ev => {
        e.status.innerText = "Connected";

        e.connectButton.onclick = () => ws.disconnect();
        e.connectButton.removeAttribute("disabled");

        e.sendButton.removeAttribute("disabled");
    });

    ws.on("close", ev => {
        e.status.innerText = "Disconnected";

        e.connectButton.onclick = () => ws.connect();
        e.connectButton.innerHTML = "Connect";
        e.connectButton.removeAttribute("disabled");

        e.sendButton.disabled = true;
    });

    ws.on("message", msg => {
        switch (msg.type) {
            case "message":
                e.messageArea.value += msg.value + "\n";
                e.messageArea.scrollTop = e.messageArea.scrollHeight;
                break;
    
            default:
                alert("? Message:\n" + msg);
                break;
        }
    });

    ws.setAutoReconnect(true);
});

function send() {
    ws.send({
        type: "message",
        value: e.msgBox.value
    });
}
```


[**index.html**](example-code/client/index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>.</title>
    <script src="script.js"></script><script src="https://user9644.github.io/scripts/easier-ws.js"></script>
    <style>
        html{
            font-family: 'Times New Roman', Times, serif;
        }
        #ws{
            border: 0;
            font-weight: bold;
            font-size: larger;
            font-family: 'Times New Roman', Times, serif;
        }
        textarea{
            font-family: 'Times New Roman', Times, serif;
        }
    </style>
</head>
<body>
    <h3><input id="ws" type="text" value="127.0.0.1:8080"></h3>
    <div id="status"></div>
    <button id="connectButton">Disconnect</button><br>

    <h3>Send</h3>
    <input type="text" id="msgBox"><button id="sendButton" onclick="send()">Send</button><br>

    <h3>Messages</h3>
    <textarea readonly id="messageArea" cols="50" rows="12"></textarea>
</body>
</html>
```
