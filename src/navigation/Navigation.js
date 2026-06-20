// TRITONGO - Navegação principal com ícones reais
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AtelieScreen from '../screens/AtelieScreen';
import MuralPautaScreen from '../screens/MuralPautaScreen';
import StudioScreen from '../screens/StudioScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import { COLORS, FONTS, SPACING } from '../theme';

const Tab = createBottomTabNavigator();

const TABS = [
  { key: 'Atelie',  label: 'Ateliê',  icon: require('../../assets/poltrona-icon.png') },
  { key: 'Mural',  label: 'Mural',   icon: require('../../assets/calendar-icon.png') },
  { key: 'Studio', label: 'Studio',  icon: require('../../assets/cell-icon.png') },
  { key: 'Config', label: 'Config',  icon: null },
];

function TabBar({ state, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = TABS[index];
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            {tab.icon ? (
              <Image
                source={tab.icon}
                style={[styles.tabIcon, { tintColor: isFocused ? COLORS.navActive : COLORS.navInactive }]}
                resizeMode="contain"
              />
            ) : (
              <Text style={[styles.tabEmoji, { opacity: isFocused ? 1 : 0.4 }]}>⚙️</Text>
            )}
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelAtivo]}>
              {tab.label}
            </Text>
            {isFocused && <View style={styles.tabIndicador} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Atelie"  component={AtelieScreen} />
        <Tab.Screen name="Mural"   component={MuralPautaScreen} />
        <Tab.Screen name="Studio"  component={StudioScreen} />
        <Tab.Screen name="Config"  component={ConfiguracoesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.navBorder,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    position: 'relative',
  },
  tabIcon: { width: 26, height: 26 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: FONTS.xs, color: COLORS.navInactive, marginTop: 3 },
  tabLabelAtivo: { color: COLORS.navActive, fontWeight: FONTS.bold },
  tabIndicador: {
    position: 'absolute', top: 0,
    width: 24, height: 2,
    backgroundColor: COLORS.navActive,
    borderRadius: 1,
  },
});
