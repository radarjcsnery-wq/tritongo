// TRITONGO - App principal
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './src/screens/SplashScreen';
import Navigation from './src/navigation/Navigation';

export default function App() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);

  if (!acessoLiberado) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SplashScreen onAcessoLiberado={() => setAcessoLiberado(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );
}
