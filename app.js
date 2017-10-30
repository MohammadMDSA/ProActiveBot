const restify = require('restify');
const {Message, Prompts, UniversalBot, ChatConnector} = require('botbuilder');

let server = restify.createServer();
server.listen(3978, () => {
	console.log(`${server.name} listening to %{server.url}`);
});

let connector = ChatConnector({
	appId: process.env.appId,
	appPassword: process.env.appPassword
});

server.post('/api/messages', connector.listen());

let bot = new UniversalBot(connector, (session) => {
	// Root dialog code goes here...
})