import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color={Colors.gray} />
        <TextInput
          style={styles.input}
          placeholder="Search For Fun"
          placeholderTextColor={Colors.gray}
          editable={false}
        />
        <Ionicons name="barcode-outline" size={20} color={Colors.gray} />
        <Ionicons name="mic-outline" size={20} color={Colors.gray} style={{ marginLeft: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    padding: 0,
  },
});
