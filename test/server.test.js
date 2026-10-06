const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server');

function startEphemeralServer() {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

test('GET /api/plan returns a generated plan', async () => {
  const server = await startEphemeralServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/plan?activity=hike&minutes=35&weather=high`);
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.equal(payload.plan.activity, 'Local Trail Hike');
    assert.equal(payload.plan.durationMinutes, 35);
    assert.ok(Array.isArray(payload.plan.plan));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('unknown path returns 404 JSON', async () => {
  const server = await startEphemeralServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/nope`);
    assert.equal(response.status, 404);

    const payload = await response.json();
    assert.equal(payload.error, 'Not found');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
