const express = require('express');
const { createServer } = require('http');
const { Readable } = require('stream');

const app = express();
const server = createServer(app);

// Mengirimkan notifikasi setiap detik
app.get('/notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendNotification = () => {
    const notification = {
      message: `Notification at ${new Date().toLocaleTimeString()}`,
    };

    res.write(`data: ${JSON.stringify(notification)}\n\n`);

    setTimeout(sendNotification, 1000);
  };

  sendNotification();
});

app.use(express.static('client'));

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
