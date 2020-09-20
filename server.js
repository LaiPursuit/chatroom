const ws = require("ws");
let ser = new ws.Server({ port: 2333 });
function sendForAll(d) {
    ser.clients.forEach((client) => {
        client.send(d);
    });
}
let clientNameList = {};
ser.on("connection", (s) => {
    s.on("message", (data) => {
        try {
            if (data == "pong") {
                return;
            }
            let dat = JSON.parse(data);
            dat.time = Math.round(new Date() / 1000);
            dat.userList = clientNameList;
            if (dat.log == "In") {
                sendForAll(
                    JSON.stringify({
                        type: "message",
                        writer: "SYSTEM",
                        data: `${dat.username} 进入了聊天室`,
                    })
                );
                clientNameList[s._socket.remoteAddress] = dat.username;
            } else {
                sendForAll(JSON.stringify(dat));
            }
        } catch (e) {
            s.send(
                JSON.stringify({
                    type: "error",
                    data: e.toString(),
                })
            );
            return;
        }
    });
})
    .on("close", (s) => {
        sendForAll(clientNameList[s._socket.remoteAddress]+"离开了")
        clientNameList[s._socket.remoteAddress] = null;
    });
setInterval(() => {
    ser.clients.forEach((c) => {
        c.send("ping");
        let time = setTimeout(() => {
            c.close();
        }, 5e3);
        function pong() {
            clearTimeout(time);
            c.removeEventListener("message", pong);
        }
        c.addEventListener("message", pong);
    });
}, 10e3);
console.log("启动成功")