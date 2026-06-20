// TRITONGO - Tela de Splash + Acesso por senha
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, Animated, KeyboardAvoidingView,
  Platform, StatusBar, Alert, ImageBackground,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { verificarAcesso, liberarAcesso, SENHA_LOTE } from '../services/storage';

export default function SplashScreen({ onAcessoLiberado }) {
  const [fase, setFase] = useState('splash');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const opacidade = useRef(new Animated.Value(0)).current;
  const opacidadeFrase = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.9)).current;

  useEffect(() => { verificarSessao(); }, []);

  async function verificarSessao() {
    const liberado = await verificarAcesso();
    animarEntrada(() => {
      if (liberado) onAcessoLiberado();
      else setFase('senha');
    });
  }

  function animarEntrada(callback) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacidade, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.spring(escala, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.delay(800),
      Animated.timing(opacidadeFrase, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(1000),
    ]).start(() => callback?.());
  }

  async function confirmarSenha() {
    if (senha.trim().toUpperCase() === SENHA_LOTE.toUpperCase()) {
      setCarregando(true);
      await liberarAcesso();
      setCarregando(false);
      onAcessoLiberado();
    } else {
      Alert.alert('Acesso negado', 'Código incorreto. Verifique com quem te enviou o TRITONGO.');
      setSenha('');
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {fase === 'senha' && (
          <Animated.View style={[styles.senhaContainer, { opacity: opacidadeFrase }]}>
            <Text style={styles.senhaLabel}>Código de acesso</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite seu código"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={confirmarSenha}
            />
            <TouchableOpacity
              style={[styles.botao, carregando && { opacity: 0.6 }]}
              onPress={confirmarSenha}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>
                {carregando ? 'Verificando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  conteudo: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: SPACING.xl, paddingBottom: 80 },
  senhaContainer: { width: '100%', alignItems: 'center' },
  senhaLabel: { fontSize: FONTS.sm, color: 'rgba(255,255,255,0.7)', marginBottom: SPACING.sm, letterSpacing: 1, textTransform: 'uppercase' },
  input: { width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: RADIUS.md, padding: SPACING.lg, fontSize: FONTS.lg, color: '#fff', textAlign: 'center', letterSpacing: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: SPACING.md },
  botao: { width: '100%', backgroundColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center' },
  botaoTexto: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: '#fff', letterSpacing: 1 },
});
