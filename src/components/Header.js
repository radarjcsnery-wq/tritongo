import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';

export default function Header({ titulo }) {
  return (
    <View style={styles.header}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl + 8, paddingBottom: SPACING.md,
    backgroundColor: 'rgba(26,15,10,0.92)',
    borderBottomWidth: 1, borderBottomColor: COLORS.navBorder,
  },
  logo: { width: 36, height: 36, marginRight: SPACING.sm },
  titulo: { flex: 1, fontSize: FONTS.sm, color: COLORS.textMuted },
});
