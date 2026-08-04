import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './node.js';

test('GET / serves the frontend HTML', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /Melhore seu Texto/);
  } finally {
    server.close();
  }
});

test('GET /reescrita returns guidance for the POST endpoint', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/reescrita`, { method: 'GET' });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.match(body.message, /POST/i);
  } finally {
    server.close();
  }
});
