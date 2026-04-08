/**
 * Local proxy server to bypass CORS restrictions when calling Oracle API from the browser.
 * Run with: node proxy-server.js
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const TOKEN_URL = process.env.ORACLE_TOKEN_URL;
const CLIENT_ID = process.env.ORACLE_CLIENT_ID;
const CLIENT_SECRET = process.env.ORACLE_CLIENT_SECRET;
const SCOPE = process.env.ORACLE_SCOPE;
const API_BASE_URL = process.env.ORACLE_CUSTOM_API_BASE_URL;

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(CLIENT_ID)}&client_secret=${encodeURIComponent(CLIENT_SECRET)}&scope=${encodeURIComponent(SCOPE)}`,
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 60) * 1000;
  return cachedToken;
}

app.get('/api/inventory', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/5below.inventory/getInventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API request failed' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Proxy server running on http://${HOST}:${PORT}`);
  console.log(`Inventory endpoint: http://${HOST}:${PORT}/api/inventory`);
});
