import WebSocket from 'ws';
import {createClient} from 'redis'
//btc
const client = createClient()
async function  startServer() {
  console.log("there is some problem her")
  try { 
    await client.connect(); 
    console.log("connected to redis")
  }
  catch (err) { 
    console.error("something went wrong " + err)
  }

}
startServer(); 

let arr :any = []
const ws_btc = new WebSocket('wss://ws.backpack.exchange');
//solana
const ws_sol =  new WebSocket('wss://ws.backpack.exchange')

const ws_eth = new WebSocket('wss://ws.backpack.exchange')
ws_btc.on('error', console.error);


ws_btc.on('open', function open() {
  ws_btc.send('{"method":"SUBSCRIBE","params":["trade.BTC_USDC"],"id":3}');
  
});

ws_sol.on('open', function open() {
  ws_sol.send('{"method":"SUBSCRIBE","params":["trade.SOL_USDC"],"id":3}');
});

ws_eth.on('open' , function open(){ 
    ws_eth.send('{"method":"SUBSCRIBE","params":["trade.ETH_USDC"],"id":3}');
});
ws_btc.on('message', async function message(data) {
  const message = JSON.parse(data.toString())
  const maindata = message.data;

  console.log('received: %s', JSON.stringify(maindata));
  arr.push({ 
    asset : 'BTC' , 
    price : parseInt((maindata.p*10000).toString()),
    decimal : 4
  })

});

ws_sol.on('message', async function message(data) {
    const message = JSON.parse(data.toString())
    const maindata = message.data;

    console.log('received: %s', JSON.stringify(maindata));
    arr.push({ 
        asset : 'SOL' , 
        price : parseInt((maindata.p*10000000).toString()),
        decimal : 7
    })

});


ws_eth.on('message', async function message(data) {
    const message = JSON.parse(data.toString())
    const maindata = message.data;

    console.log('received: %s', JSON.stringify(maindata));
    arr.push({ 
        asset : 'ETH' , 
        price : parseInt((maindata.p*1000000).toString()),
        decimal : 6
    })

});




setInterval(async()=> {if(arr.length>0){await  client.publish("trades"  , JSON.stringify(arr) )
    console.log("published the data " +JSON.stringify(arr))
    arr = [];
}; 
    
    
} , 100)
//setInterval - send message every 100 mili second 

