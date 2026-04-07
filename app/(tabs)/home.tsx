import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { SearchBar } from '../../src/components/SearchBar';
import { Colors } from '../../src/constants/colors';
import { categories } from '../../src/data/products';

const CATEGORY_COLORS: Record<string, string> = {
  Easter: '#FDE68A',
  'New & Now': '#BFDBFE',
  Room: '#FED7AA',
  'Toys & Games': '#C4B5FD',
  Tech: '#D1D5DB',
  Beauty: '#FBCFE8',
  Style: '#A7F3D0',
  'Arts & Crafts': '#FCA5A5',
  'Candy & Snacks': '#FDE047',
  'Pet Supplies': '#BAE6FD',
  Sports: '#D9F99D',
  Books: '#E9D5FF',
};

function CategoryCircle({ name }: { name: string }) {
  const bg = CATEGORY_COLORS[name] || Colors.grayLight;
  return (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryCircle, { backgroundColor: bg }]}>
        <Text style={styles.categoryEmoji}>
          {name === 'Easter' && '🐣'}
          {name === 'New & Now' && '🆕'}
          {name === 'Room' && '🛋️'}
          {name === 'Toys & Games' && '🎮'}
          {name === 'Tech' && '🎧'}
          {name === 'Beauty' && '💄'}
          {name === 'Style' && '👜'}
          {name === 'Arts & Crafts' && '🎨'}
          {name === 'Candy & Snacks' && '🍬'}
          {name === 'Pet Supplies' && '🐾'}
          {name === 'Sports' && '⚽'}
          {name === 'Books' && '📚'}
        </Text>
      </View>
      <Text style={styles.categoryLabel} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <SearchBar />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Pickup Store Banner */}
        <View style={styles.pickupBanner}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.pickupText}>
            Pickup Store: <Text style={styles.pickupStore}>Center City, Philadelphia</Text>
          </Text>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>the hunt is FUN!</Text>
          <Text style={styles.heroSub}>Easter Shop: NOW OPEN!!</Text>
          <Pressable
            style={styles.heroBtn}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.heroBtnText}>shop all</Text>
          </Pressable>
        </View>

        {/* Shop by Category */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <Pressable key={cat} onPress={() => router.push('/(tabs)/shop')}>
              <CategoryCircle name={cat} />
            </Pressable>
          ))}
        </View>

        {/* Inventory Promo */}
        <View style={styles.promoCard}>
          <Ionicons name="map" size={28} color={Colors.primary} />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Check store inventory!</Text>
            <Text style={styles.promoSub}>
              See what's in stock at Five Below stores near you.
            </Text>
          </View>
          <Pressable
            style={styles.promoCta}
            onPress={() => router.push('/(tabs)/inventory')}
          >
            <Text style={styles.promoCtaText}>View Map</Text>
          </Pressable>
        </View>

        {/* Our Fave Products */}
        <Pressable onPress={() => router.push('/(tabs)/shop')}>
          <Text style={styles.sectionTitle}>Our Fave Products</Text>
          <Text style={[styles.seeAll, { marginTop: -12, marginBottom: 16 }]}>
            See all →
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  pickupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
  },
  pickupText: {
    fontSize: 13,
    color: Colors.black,
  },
  pickupStore: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  heroBanner: {
    backgroundColor: '#E0F2FE',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
  },
  heroBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  heroBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.black,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: 80,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  promoSub: {
    fontSize: 12,
    color: Colors.gray,
  },
  promoCta: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  promoCtaText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
});
