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
