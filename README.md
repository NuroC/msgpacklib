receive packets:

```js
onmessage = function (e) {
    let data = e.data;
    let packet = new Reader(data);
    let [packetID, info] = packet.readData();
}
```
