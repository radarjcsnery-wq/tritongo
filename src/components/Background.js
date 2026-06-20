import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export default function Background({ children, overlay = 0.55 }) {
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: `rgba(15,8,4,${overlay})` }]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
});
