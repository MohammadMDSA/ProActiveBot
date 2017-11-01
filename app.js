const restify = require('restify');
const { Message, Prompts, UniversalBot, ChatConnector } = require('botbuilder');
const http = require('http');
const mongo = require('./MongoInterface');

let db = new mongo();

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

		db.find('users', {}, (result) => {
			result.forEach((item) => {
				db.insert('proActive',
					{
						userId: item.userId,
						isSent: false,
						text: data
					});
			});
		});
	});
	res.write('');
	res.end();
}).listen(8080);

let connector = new ChatConnector({
	appId: '22c1ba29-61c8-4be1-ab68-1fdd1ab627cf',
	appPassword: 'iFD1HuaBL6xbgj0GqCnzwDd'
});

server.post('/api/messages', connector.listen());

let bot = new UniversalBot(connector, (session) => {
	// Root dialog code goes here...
	db.find('users', { "userId": session.message.user.id }, (result) => {
		if (result.length === 0) {
			db.insert('users', {
				userId: session.message.user.id,
				addressHandler: session.message.address
			});
		}
	});

	setInterval(() => {
		db.find('proActive',
			{
				$and: [{ "userId": session.message.user.id }, { "isSent": false }]
			},
			(result) => {
				result.forEach((item) => {
					session.send(item.text);
				});

				db.updateFields('proActive', { $and: [{ "userId": session.message.user.id }, { "isSent": false }] }, { "isSent": true })
			}
		);
	}, 100);
	session.send('Yo');
});
