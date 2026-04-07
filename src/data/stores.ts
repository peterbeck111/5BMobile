export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
}

export const stores: Store[] = [
  {
    id: '1010',
    name: 'Five Below Center City',
    address: '1529 Chestnut St',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19102',
    latitude: 39.9513,
    longitude: -75.1667,
  },
  {
    id: '1011',
    name: 'Five Below Market East',
    address: '701 Market Street',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19106',
    latitude: 39.9517,
    longitude: -75.1530,
  },
  {
    id: '1012',
    name: 'Five Below Columbus Blvd',
    address: '2250 S Columbus Blvd, Space B',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19148',
    latitude: 39.9246,
    longitude: -75.1414,
  },
  {
    id: '1013',
    name: 'Five Below Passyunk',
    address: '2300 Passyunk Ave',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19145',
    latitude: 39.9248,
    longitude: -75.1722,
  },
  {
    id: '1014',
    name: 'Five Below Roosevelt Blvd',
    address: '4640 E Roosevelt Blvd',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19124',
    latitude: 40.0351,
    longitude: -75.0838,
  },
  {
    id: '1015',
    name: 'Five Below Aramingo',
    address: '2495 Aramingo Ave',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19125',
    latitude: 39.9832,
    longitude: -75.1182,
  },
  {
    id: '1016',
    name: 'Five Below Wheatsheaf',
    address: '2200 Wheatsheaf Lane, Suite E6',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19137',
    latitude: 40.0022,
    longitude: -75.0781,
  },
];

/** Calculate distance in miles between two lat/lng points (Haversine formula) */
export function getDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Find stores within a given radius (miles) from a point */
export function findNearbyStores(
  latitude: number,
  longitude: number,
  radiusMiles: number = 15
): Store[] {
  return stores
    .map((store) => ({
      ...store,
      distance: getDistanceMiles(latitude, longitude, store.latitude, store.longitude),
    }))
    .filter((s) => s.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}
