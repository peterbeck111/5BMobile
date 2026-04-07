import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Store } from '../data/stores';
import { Transfer } from '../data/inventory';

interface StoreInventoryCardProps {
  store: Store;
  transfers: Transfer[];
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

export default function StoreInventoryCard({
  store,
  transfers,
}: StoreInventoryCardProps) {
  const stockOnHand = transfers.length > 0
    ? Math.max(...transfers.map((t) => t.stockOnHand))
    : 0;
  const inStock = stockOnHand > 0;

  const deliveries = transfers.filter((t) => t.estArrDate !== '');
  const sortedTransfers = [...deliveries].sort(
    (a, b) => new Date(a.estArrDate).getTime() - new Date(b.estArrDate).getTime()
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="storefront-outline" size={22} color={Colors.primary} />
        <View style={styles.headerText}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeAddress}>
            {store.address}, {store.city}, {store.state} {store.zip}
          </Text>
        </View>
      </View>

      <View style={styles.stockRow}>
        <Ionicons
          name={inStock ? 'checkmark-circle' : 'close-circle'}
          size={18}
          color={inStock ? Colors.green : Colors.red}
        />
        <Text style={[styles.stockText, { color: inStock ? Colors.green : Colors.red }]}>
          {inStock ? `In Stock: ${stockOnHand} units` : 'Out of Stock'}
        </Text>
      </View>

      {sortedTransfers.length > 0 ? (
        <View style={styles.deliveriesSection}>
          <Text style={styles.deliveriesTitle}>Incoming Deliveries</Text>
          {sortedTransfers.map((transfer, index) => (
            <View key={index} style={styles.deliveryRow}>
              <Ionicons name="cube-outline" size={16} color={Colors.primary} />
              <Text style={styles.deliveryText}>
                {transfer.qtyExpected} units — arriving {formatDate(transfer.estArrDate)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.deliveriesSection}>
          <Text style={styles.noDeliveries}>No incoming deliveries</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 12,
    color: Colors.gray,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.grayLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveriesSection: {
    gap: 6,
  },
  deliveriesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  deliveryText: {
    fontSize: 13,
    color: Colors.black,
  },
  noDeliveries: {
    fontSize: 13,
    color: Colors.gray,
    fontStyle: 'italic',
  },
});
