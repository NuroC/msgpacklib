receive packets:

```js
onmessage = function (e) {
    let data = e.data;
    let packet = new Reader(data);
    let [packetID, info] = packet.readData();
}
```
 send packets:
 
 ```js
 function send(packetID, ...args) {
    let binData = new Writer(1, args).setString(packetID).setInt(144 + args.length, !0);
    args && args.forEach(e => {
        switch (typeof e) {
            case 'number':
                Number.isSafeInteger(e) ? binData.setInt(e) : binData.setFloat(e);
                break;
            case 'string':
                binData.setString(e);
        }
    });
    let packet = binData.arraybuffer;
    socket.send(packet);
    return packet;
}
```
