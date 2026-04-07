import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Store } from '../data/stores';
import { Transfer } from '../data/inventory';

interface StoreDetailCardProps {
  store: Store;
  transfers: Transfer[];
  onClose: () => void;
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

export default function StoreDetailCard({
  store,
  transfers,
  onClose,
}: StoreDetailCardProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, []);

  const stockOnHand = transfers.length > 0
    ? Math.max(...transfers.map((t) => t.stockOnHand))
    : 0;
  const inStock = stockOnHand > 0;

  const deliveries = transfers.filter((t) => t.estArrDate !== '');
  const sortedTransfers = [...deliveries].sort(
    (a, b) => new Date(a.estArrDate).getTime() - new Date(b.estArrDate).getTime()
  );

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeAddress}>
            {store.address}, {store.city}, {store.state} {store.zip}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={28} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.stockRow}>
        <Ionicons
          name={inStock ? 'checkmark-circle' : 'close-circle'}
          size={20}
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
              <Ionicons name="cube-outline" size={18} color={Colors.primary} />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 13,
    color: Colors.gray,
  },
  closeButton: {
    padding: 4,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.grayLight,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deliveriesSection: {
    gap: 8,
  },
  deliveriesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: Colors.black,
  },
  noDeliveries: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
  },
});
