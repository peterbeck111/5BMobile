import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Colors } from '../../src/constants/colors';
import { stores, Store } from '../../src/data/stores';
import {
  Transfer,
  mockTransfers,
  getTransfersForStore,
  hasInventoryData,
  productToItemMap,
} from '../../src/data/inventory';
import { fetchInventory } from '../../src/services/inventoryApi';
import { useWatchlist } from '../../src/context/WatchlistContext';
import StoreDetailCard from '../../src/components/StoreDetailCard';
import StoreInventoryCard from '../../src/components/StoreInventoryCard';

let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
let WebMap: any = null;

if (Platform.OS === 'web') {
  WebMap = require('../../src/components/WebMap').default;
} else {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

const PHILADELPHIA_CENTER = {
  latitude: 39.9650,
  longitude: -75.1450,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

type ViewMode = 'map' | 'list';

export default function InventoryScreen() {
  const isWeb = Platform.OS === 'web';
  const { watchlist } = useWatchlist();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>('5');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allTransfers, setAllTransfers] = useState<Transfer[]>(mockTransfers);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      fetchInventory()
        .then(({ transfers }) => {
          if (!cancelled) {
            setAllTransfers(transfers);
            setDataSource('api');
          }
        })
        .catch((err) => {
          console.warn('API fetch failed, using mock data:', err.message);
          if (!cancelled) {
            setDataSource('mock');
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }, [])
  );

  // Auto-select first watched product if current selection is removed
  const activeProductId = useMemo(() => {
    if (watchlist.length === 0) return null;
    if (selectedProductId && watchlist.some((p) => p.id === selectedProductId)) {
      return selectedProductId;
    }
    return watchlist[0].id;
  }, [watchlist, selectedProductId]);

  const activeProduct = watchlist.find((p) => p.id === activeProductId) || null;

  const transfersByStore = useMemo(() => {
    const result: Record<string, Transfer[]> = {};
    for (const store of stores) {
      if (activeProductId && hasInventoryData(activeProductId)) {
        result[store.id] = getTransfersForStore(allTransfers, store.id, activeProductId);
      } else {
        result[store.id] = [];
      }
    }
    return result;
  }, [activeProductId, allTransfers]);

  const handleMarkerPress = (store: Store) => {
    setSelectedStore(store);
  };

  const handleCloseDetail = () => {
    setSelectedStore(null);
  };

  if (watchlist.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.emptyState}>
          <Ionicons name="eye-off-outline" size={64} color={Colors.gray} />
          <Text style={styles.emptyTitle}>No watched items</Text>
          <Text style={styles.emptySubtitle}>
            Go to the Shop tab and tap "Watch Item" on products you're interested in to check their store inventory.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* Product Selector */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        {activeProduct?.image ? (
          <Image source={{ uri: activeProduct.image }} style={styles.dropdownProductImage} />
        ) : (
          <Ionicons name="pricetag-outline" size={18} color={Colors.primary} />
        )}
        <Text style={styles.dropdownButtonText} numberOfLines={1}>
          {activeProduct?.name?.toUpperCase() ?? 'SELECT A PRODUCT'}
        </Text>
        <Ionicons
          name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.gray}
        />
      </TouchableOpacity>
      {dropdownOpen && (
        <View style={styles.dropdownList}>
          {watchlist.map((product) => {
            const isActive = product.id === activeProductId;
            return (
              <TouchableOpacity
                key={product.id}
                style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                onPress={() => {
                  setSelectedProductId(product.id);
                  setSelectedStore(null);
                  setDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    isActive && styles.dropdownItemTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Data source indicator */}
      {loading ? (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading inventory data...</Text>
        </View>
      ) : (
        <View style={styles.sourceBanner}>
          <Ionicons
            name={dataSource === 'api' ? 'cloud-done-outline' : 'document-outline'}
            size={14}
            color={dataSource === 'api' ? Colors.green : Colors.orange}
          />
          <Text style={styles.sourceText}>
            {dataSource === 'api' ? 'Live data from API' : 'Using cached data'}
          </Text>
        </View>
      )}

      {/* Inventory status hint */}
      {activeProductId && !hasInventoryData(activeProductId) && (
        <View style={styles.noDataBanner}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.orange} />
          <Text style={styles.noDataText}>
            No inventory data available for this item in Philadelphia.
          </Text>
        </View>
      )}

      {/* View Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleActive]}
          onPress={() => { setViewMode('map'); setSelectedStore(null); }}
        >
          <Ionicons
            name="map"
            size={16}
            color={viewMode === 'map' ? Colors.white : Colors.primary}
          />
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}
          onPress={() => { setViewMode('list'); setSelectedStore(null); }}
        >
          <Ionicons
            name="list"
            size={16}
            color={viewMode === 'list' ? Colors.white : Colors.primary}
          />
          <Text
            style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          {isWeb && WebMap ? (
            <WebMap
              stores={stores}
              transfersByStore={transfersByStore}
              onSelectStore={(id: string) => {
                const store = stores.find((s) => s.id === id);
                if (store) handleMarkerPress(store);
              }}
            />
          ) : MapView ? (
            <>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={PHILADELPHIA_CENTER}
                showsUserLocation={false}
                showsMyLocationButton={false}
              >
                {stores.map((store) => (
                  <Marker
                    key={store.id}
                    coordinate={{
                      latitude: store.latitude,
                      longitude: store.longitude,
                    }}
                    title={store.name}
                    pinColor={Colors.primary}
                    onPress={() => handleMarkerPress(store)}
                  />
                ))}
              </MapView>
              {selectedStore && (
                <StoreDetailCard
                  store={selectedStore}
                  transfers={transfersByStore[selectedStore.id] || []}
                  onClose={handleCloseDetail}
                />
              )}
            </>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <StoreInventoryCard
              store={item}
              transfers={transfersByStore[item.id] || []}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
  },
  dropdownProductImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
    flex: 1,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.primary,
  },
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  sourceText: {
    fontSize: 11,
    color: Colors.gray,
  },
  noDataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  noDataText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
