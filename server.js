const WebSocket = require('ws');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient



//连接MongoDB数据库
const mongoUrl = 'mongodb://localhost:27017/shop'
//连接选项
const mongoOption = {
	useUnifiedTopology: true,
	auth:{user:"yangxiaokai",password:"123456abc"}
}
const wss = new WebSocket.Server({ port: 8080 });

MongoClient.connect(mongoUrl,mongoOption,function(err,client){

	const db = client.db();
	const collection = db.collection('chat_msg')	//选择集合（表）

	wss.on('connection', function connection(ws) {
		//接收客户端数据
		ws.on('message', function incoming(message) {
			var t = moment().format();		//当前时间
			ws.send(message + " " + t);		//向客户端发送数据

			//将数据保存至 mongodb
			var doc = {msg:message,time:t};
			collection.insertOne(doc,function(err,result){
				console.log(err);
				console.log(message + " 消息入库");
			})
			//广播 向所有在线用户发送数据
			wss.clients.forEach(function each(client) {
				if ( client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(message + " " + t);
				}
			});
		});

	});

});