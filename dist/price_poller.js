import WebSocket from 'ws';
import { createClient } from 'redis';
//btc
const client = createClient();
async function startServer() {
    console.log("there is some problem her");
    try {
        await client.connect();
        console.log("connected to redis");
    }
    catch (err) {
        console.error("something went wrong " + err);
    }
}
startServer();
const ws_btc = new WebSocket('wss://ws.backpack.exchange');
//solana
const ws_sol = new WebSocket('wss://ws.backpack.exchange/');
ws_btc.on('error', console.error);
ws_btc.on('open', function open() {
    console.log("reached till here");
    ws_btc.send('{"method":"SUBSCRIBE","params":["bookTicker.BTC_USDC"],"id":1}');
});
ws_sol.on('open', function open() {
    ws_sol.send('{"method":"SUBSCRIBE","params":["bookTicker.SOL_USDC"],"id":1}');
});
ws_btc.on('message', async function message(data) {
    const message = JSON.parse(data.toString());
    const maindata = message.data;
    console.log('received: %s', JSON.stringify(maindata));
    await client.publish("trades", JSON.stringify(data));
});
//setInterval - send message every 100 mili second 
//# sourceMappingURL=price_poller.js.map