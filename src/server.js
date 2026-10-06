const http = require('node:http');
const { URL } = require('node:url');
const { suggestOutdoorPlan } = require('./planner');

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function createServer() {
  return http.createServer((req, res) => {
    if (!req.url) {
      sendJson(res, 400, { error: 'Invalid request URL' });
      return;
    }

    const requestUrl = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && requestUrl.pathname === '/api/plan') {
      const plan = suggestOutdoorPlan({
        activityType: requestUrl.searchParams.get('activity') || 'walk',
        minutesAvailable: Number(requestUrl.searchParams.get('minutes')) || 30,
        weatherTolerance: requestUrl.searchParams.get('weather') || 'mild',
      });

      sendJson(res, 200, { plan });
      return;
    }

    if (req.method === 'GET' && requestUrl.pathname === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  });
}

function startServer(port = 3000) {
  const server = createServer();
  server.listen(port, () => {
    console.log(`TrailBuddy API listening on http://localhost:${server.address().port}`);
  });
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  startServer(port);
}

module.exports = { createServer, startServer };
