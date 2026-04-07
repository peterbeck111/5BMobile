import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        f<Text style={styles.logoI}>i</Text>ve bel
        <Text style={styles.logoO}>o</Text>w
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  logoI: {
    color: Colors.white,
  },
  logoO: {
    color: Colors.white,
  },
});
