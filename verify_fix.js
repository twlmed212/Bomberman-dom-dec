
import pkg from './backend/node_modules/ws/index.js';
const { WebSocket } = pkg;

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Tested: Connection opened (Lazy connect simulation)');
    setTimeout(() => {
        console.log('Sending JOIN...');
        ws.send(JSON.stringify({ type: 'JOIN', playerName: 'verifyUser' }));
    }, 500);
});

let connectedReceived = false;
let lobbyUpdateReceived = false;

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('Received:', msg.type);

    if (msg.type === 'CONNECTED') {
        connectedReceived = true;
    }
    if (msg.type === 'LOBBY_UPDATE') {
        lobbyUpdateReceived = true;
    }

    if (connectedReceived && lobbyUpdateReceived) {
        console.log('SUCCESS: Both CONNECTED and LOBBY_UPDATE received.');
        process.exit(0);
    }
});

ws.on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});

setTimeout(() => {
    console.log('Timeout waiting for messages');
    process.exit(1);
}, 5000);
