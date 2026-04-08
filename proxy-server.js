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

// Log config at startup (mask secrets)
console.log('--- Proxy Config ---');
console.log('TOKEN_URL:', TOKEN_URL || '(NOT SET)');
console.log('CLIENT_ID:', CLIENT_ID ? CLIENT_ID.substring(0, 8) + '...' : '(NOT SET)');
console.log('CLIENT_SECRET:', CLIENT_SECRET ? '****' : '(NOT SET)');
console.log('SCOPE:', SCOPE || '(NOT SET)');
console.log('API_BASE_URL:', API_BASE_URL || '(NOT SET)');
console.log('--------------------');

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[TOKEN] Using cached token (expires in', Math.round((tokenExpiry - Date.now()) / 1000), 'sec)');
    return cachedToken;
  }

  console.log('[TOKEN] Requesting new token from:', TOKEN_URL);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(CLIENT_ID)}&client_secret=${encodeURIComponent(CLIENT_SECRET)}&scope=${encodeURIComponent(SCOPE)}`,
  });

  console.log('[TOKEN] Response status:', response.status, response.statusText);

  if (!response.ok) {
    const body = await response.text();
    console.error('[TOKEN] Error body:', body);
    throw new Error(`Token request failed: ${response.status} - ${body}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 60) * 1000;
  console.log('[TOKEN] Got new token, expires in', data.expires_in, 'sec');
  return cachedToken;
}

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.get('/api/inventory', async (req, res) => {
  try {
    const token = await getAccessToken();
    const apiUrl = `${API_BASE_URL}/5below.inventory/getInventory`;
    console.log('[API] Fetching:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('[API] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const body = await response.text();
      console.error('[API] Error body:', body);
      return res.status(response.status).json({ error: 'API request failed', details: body });
    }

    const data = await response.json();
    console.log('[API] Success, returned', Array.isArray(data) ? data.length : '?', 'records');
    res.json(data);
  } catch (err) {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Proxy server running on http://${HOST}:${PORT}`);
  console.log(`Inventory endpoint: http://${HOST}:${PORT}/api/inventory`);
});
