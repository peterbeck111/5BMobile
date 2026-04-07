import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

const QBCS_LOGO_URI = 'https://www.qbcs.com/wp-content/uploads/2023/05/NEW-QBCS-LOGO.webp';

function QbcsWatermark() {
  return (
    <View style={styles.watermark}>
      <Image source={{ uri: QBCS_LOGO_URI }} style={styles.watermarkLogo} resizeMode="contain" />
      <Text style={styles.watermarkText}>Prototype by QBCS</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopColor: Colors.grayBorder,
          height: 82,
          paddingBottom: 4,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="eye-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? Colors.primary : Colors.gray;
          const icon = options.tabBarIcon?.({ color, size: 22, focused: isFocused });

          return (
            <View key={route.key} style={styles.tabItem}>
              <View style={{ alignItems: 'center' }} onTouchEnd={onPress}>
                {icon}
                <Text style={[styles.tabLabel, { color }]}>{options.title}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <QbcsWatermark />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.grayBorder,
    paddingTop: 6,
    paddingBottom: 4,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  watermark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
    paddingBottom: 2,
  },
  watermarkLogo: {
    width: 16,
    height: 16,
  },
  watermarkText: {
    fontSize: 9,
    color: '#A0A0A0',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
