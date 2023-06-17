const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Simulasi pembaruan cuaca setiap detik
setInterval(() => {
  const temperature = Math.floor(Math.random() * 30) + 1;
  const humidity = Math.floor(Math.random() * 100) + 1;
  const weatherData = {
    temperature,
    humidity,
  };

  // Kirim data ke semua klien yang terhubung
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(weatherData));
    }
  });
}, 1000);

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});