import { Platform } from 'react-native';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const TOKEN_URL: string = extra.oracleTokenUrl ?? '';
const CLIENT_ID: string = extra.oracleClientId ?? '';
const CLIENT_SECRET: string = extra.oracleClientSecret ?? '';
const SCOPE: string = extra.oracleScope ?? '';
const API_BASE_URL: string = extra.oracleApiBaseUrl ?? '';

const INVENTORY_ENDPOINT = `${API_BASE_URL}/5below.inventory/getInventory`;

// On web, use the proxy to avoid CORS issues (configurable via env var for deployment)
const PROXY_URL = extra.proxyUrl ?? 'http://localhost:3001/api/inventory';

// Debug: log resolved config values
console.log('--- inventoryApi Config ---');
console.log('Platform:', Platform.OS);
console.log('extra.proxyUrl:', extra.proxyUrl ?? '(NOT SET - using default)');
console.log('PROXY_URL:', PROXY_URL);
console.log('API_BASE_URL:', API_BASE_URL || '(NOT SET)');
console.log('INVENTORY_ENDPOINT:', INVENTORY_ENDPOINT);
console.log('TOKEN_URL:', TOKEN_URL || '(NOT SET)');
console.log('---------------------------');

interface ApiTransfer {
  loc: number;
  est_arr_date: string | null;
  item: string;
  qty_expected: number | null;
  stock_on_hand: number;
  add_1: string;
  city: string;
  state: string;
  country_id: string;
  post: string;
}

export interface Transfer {
  toLocId: string;
  estArrDate: string;
  item: string;
  qtyExpected: number;
  stockOnHand: number;
}

export interface StoreFromApi {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
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
  return cachedToken!;
}

async function fetchFromApi(): Promise<ApiTransfer[]> {
  if (Platform.OS === 'web') {
    // Use local proxy to bypass CORS
    const response = await fetch(PROXY_URL);
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }
    return response.json();
  }

  // Native: call Oracle API directly
  const token = await getAccessToken();
  const response = await fetch(INVENTORY_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Inventory API failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchInventory(): Promise<{
  transfers: Transfer[];
  stores: StoreFromApi[];
}> {
  const data = await fetchFromApi();

  const storeMap = new Map<string, StoreFromApi>();
  const transfers: Transfer[] = [];

  for (const row of data) {
    const storeId = String(row.loc);

    if (!storeMap.has(storeId)) {
      storeMap.set(storeId, {
        id: storeId,
        address: row.add_1,
        city: row.city,
        state: row.state,
        zip: row.post,
      });
    }

    if (row.est_arr_date && row.qty_expected != null) {
      // Record with an incoming delivery
      const d = new Date(row.est_arr_date);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

      transfers.push({
        toLocId: storeId,
        estArrDate: dateStr,
        item: row.item,
        qtyExpected: row.qty_expected,
        stockOnHand: row.stock_on_hand,
      });
    } else {
      // Stock-only record (no delivery) — still need to track stock on hand
      transfers.push({
        toLocId: storeId,
        estArrDate: '',
        item: row.item,
        qtyExpected: 0,
        stockOnHand: row.stock_on_hand,
      });
    }
  }

  return {
    transfers,
    stores: Array.from(storeMap.values()),
  };
}
