
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to server');
    // Send JOIN
    ws.send(JSON.stringify({ type: 'JOIN', playerName: 'testuser' }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('Received:', msg.type, msg);

    if (msg.type === 'CONNECTED') {
        console.log('FAIL: CONNECTED received. Waiting for LOBBY_UPDATE.');
    }
    if (msg.type === 'LOBBY_UPDATE') {
        console.log('PASS: LOBBY_UPDATE received.'); // We expect this too
    }
});

ws.on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});
