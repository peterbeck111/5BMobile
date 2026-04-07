import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import type { Product } from '../data/products';
import { useWatchlist } from '../context/WatchlistContext';

interface ProductCardProps {
  product: Product;
}

function StockBadge({ status }: { status: Product['stockStatus'] }) {
  if (status === 'in_stock') {
    return (
      <View style={styles.stockRow}>
        <Ionicons name="checkmark-circle" size={14} color={Colors.green} />
        <Text style={[styles.stockText, { color: Colors.green }]}>In Stock</Text>
      </View>
    );
  }
  if (status === 'low_stock') {
    return (
      <View style={styles.stockRow}>
        <Ionicons name="warning" size={14} color={Colors.orange} />
        <Text style={[styles.stockText, { color: Colors.orange }]}>Low Stock</Text>
      </View>
    );
  }
  return (
    <View style={styles.stockRow}>
      <Ionicons name="close-circle" size={14} color={Colors.red} />
      <Text style={[styles.stockText, { color: Colors.red }]}>Out of Stock</Text>
    </View>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToWatchlist, removeFromWatchlist, isWatching } = useWatchlist();
  const watching = isWatching(product.id);

  const toggleWatch = () => {
    if (watching) {
      removeFromWatchlist(product.id);
    } else {
      addToWatchlist(product);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <StockBadge status={product.stockStatus} />
      <Pressable
        onPress={toggleWatch}
        style={[styles.watchBtn, watching && styles.watchBtnActive]}
      >
        <Ionicons
          name={watching ? 'eye' : 'eye-outline'}
          size={16}
          color={watching ? Colors.white : Colors.primary}
        />
        <Text style={[styles.watchBtnText, watching && styles.watchBtnTextActive]}>
          {watching ? 'Watching' : 'Watch Item'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: Colors.grayLight,
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
    minHeight: 34,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '500',
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  watchBtnActive: {
    backgroundColor: Colors.primary,
  },
  watchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  watchBtnTextActive: {
    color: Colors.white,
  },
});
