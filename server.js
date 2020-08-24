const WebSocket = require('ws');
var moment = require('moment');

const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws) {
			//接收客户端数据
	ws.on('message', function incoming(message) {

	var t = moment().format();		//当前时间
	   console.log(t);
	ws.send(message + " " + t);		//向客户端发送数据

	//广播 向所有在线用户发送数据
	wss.clients.forEach(function each(client) {
	if ( client !== ws && client.readyState === WebSocket.OPEN) {
	client.send(message + " " + t);
                	}
           });
       });
  });
