import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Store } from '../data/stores';
import { Transfer } from '../data/inventory';
import { Colors } from '../constants/colors';

interface WebMapProps {
  stores: Store[];
  transfersByStore: Record<string, Transfer[]>;
  onSelectStore: (storeId: string) => void;
}

function formatDate(dateStr: string): string {
  const [month, day, year] = dateStr.split('/');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function WebMap({ stores, transfersByStore, onSelectStore }: WebMapProps) {
  const html = useMemo(() => {
    const markersJs = stores
      .map((store) => {
        const transfers = transfersByStore[store.id] || [];
        const stockOnHand = transfers.length > 0
          ? Math.max(...transfers.map((t) => t.stockOnHand))
          : 0;
        const inStock = stockOnHand > 0;
        const deliveries = transfers.filter((t) => t.estArrDate !== '');
        const sorted = [...deliveries].sort(
          (a, b) => new Date(a.estArrDate).getTime() - new Date(b.estArrDate).getTime()
        );
        const deliveryRows = sorted.length > 0
          ? sorted.map((t) => `<div style="padding:2px 0;">📦 ${t.qtyExpected} units — arriving ${formatDate(t.estArrDate)}</div>`).join('')
          : `<div style="padding:2px 0;color:#6B7280;font-style:italic;">No incoming deliveries</div>`;
        const stockHtml = inStock
          ? `<div style="color:#16A34A;font-weight:600;">✅ In Stock: ${stockOnHand} units</div>`
          : `<div style="color:#DC2626;font-weight:600;">❌ Out of Stock</div>`;

        const popup = `
          <div style="min-width:220px;font-family:sans-serif;">
            <div style="font-weight:700;font-size:14px;margin-bottom:2px;">${store.name}</div>
            <div style="color:#6B7280;font-size:12px;margin-bottom:8px;">${store.address}, ${store.city}, ${store.state} ${store.zip}</div>
            ${stockHtml}
            <div style="margin-top:8px;font-weight:700;font-size:13px;">Incoming Deliveries</div>
            ${deliveryRows}
          </div>
        `.replace(/\n/g, '').replace(/'/g, "\\'");

        return `L.marker([${store.latitude}, ${store.longitude}], {icon: blueIcon}).addTo(map).bindPopup('${popup}');`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([39.9650, -75.1450], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    var blueIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    ${markersJs}
  </script>
</body>
</html>`;
  }, [stores, transfersByStore]);

  return (
    <iframe
      srcDoc={html}
      style={iframeStyle}
      title="Store Map"
    />
  );
}

const iframeStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
};
