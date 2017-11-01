const restify = require('restify');
const { Message, Prompts, UniversalBot, ChatConnector } = require('botbuilder');
const http = require('http');

const server = restify.createServer();
server.listen(4000, () => {
	console.log(`${server.name} listening to ${server.url}`);
});

const httpServer = http.createServer((req, res) => {
	console.log('got something');
	res.writeHead(200, { 'Content-Type': 'text/html' });
	let data = '';
	req.on('data', (byte) => {
		data = byte + '';
		console.log(byte + '');
	});
	res.write('');
	res.end();
}).listen(8080);

let connector = new ChatConnector({
	appId: '',
	appPassword: ''
});

server.post('/api/messages', connector.listen());

let bot = new UniversalBot(connector, (session) => {
	// Root dialog code goes here...
		setInterval(() => {
			
		}, 60000);

});
