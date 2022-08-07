import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreditCard } from './CreditCard';

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    top: -100,
    marginHorizontal: 16,
  },
  placeholder: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  transaction: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    height: 60,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
});

export const Main = () => {
  return (
    <View style={styles.flex1}>
      <CreditCard />
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column', marginRight: 8 }}>
            <View
              style={[
                styles.placeholder,
                {
                  height: 96,
                  width: '100%',
                  marginBottom: 8,
                },
              ]}
            />
            <View
              style={[
                styles.placeholder,
                {
                  height: 96,
                  width: '100%',
                },
              ]}
            />
          </View>
          <View style={[styles.placeholder, { height: 200, flex: 1 }]} />
        </View>
      </View>
      <View style={{ marginTop: 24, marginHorizontal: 16 }}>
        <Text style={styles.heading}>Latest Transactions</Text>
        <View style={styles.transaction} />
        <View style={styles.transaction} />
        <View style={styles.transaction} />
        <View style={styles.transaction} />
      </View>
    </View>
  );
};
