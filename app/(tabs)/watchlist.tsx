import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Colors } from '../../src/constants/colors';
import { useWatchlist } from '../../src/context/WatchlistContext';
import type { Product } from '../../src/data/products';

function WatchlistItem({ product }: { product: Product }) {
  const { removeFromWatchlist } = useWatchlist();
  return (
    <View style={styles.item}>
      <Image source={{ uri: product.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.itemCategory}>{product.category}</Text>
      </View>
      <Pressable
        onPress={() => removeFromWatchlist(product.id)}
        style={styles.removeBtn}
      >
        <Ionicons name="close-circle" size={24} color={Colors.red} />
      </Pressable>
    </View>
  );
}

export default function WatchlistScreen() {
  const { watchlist } = useWatchlist();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleBar}>
        <Ionicons name="eye" size={22} color={Colors.primary} />
        <Text style={styles.title}>My Watchlist</Text>
        <Text style={styles.count}>{watchlist.length} items</Text>
      </View>
      {watchlist.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="eye-off-outline" size={64} color={Colors.grayBorder} />
          <Text style={styles.emptyTitle}>No watched items yet</Text>
          <Text style={styles.emptySub}>
            Browse products and tap "Watch Item" to get notified when they ship to
            a store near you.
          </Text>
          <Pressable
            style={styles.browseCta}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.browseCtaText}>Browse Products</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WatchlistItem product={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    flex: 1,
  },
  count: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  list: {
    backgroundColor: Colors.white,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.grayLight,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grayBorder,
    marginHorizontal: 16,
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseCta: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseCtaText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
