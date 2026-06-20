// TRITONGO - Ateliê (Tela do Guru)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, RefreshControl, StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import Background from '../components/Background';
import { Image } from 'react-native';
import { carregarGuru } from '../services/storage';
import { buscarNoticias, CATEGORIAS } from '../services/rss';

// Frases do Guru baseadas no momento do dia
function getFraseGuru(nomeGuru) {
  const hora = new Date().getHours();
  if (hora < 12) return `Bom dia! Um novo dia de histórias começa. O que você vai contar ao mundo hoje?`;
  if (hora < 18) return `A tarde é o momento da reflexão. Escolha bem suas palavras — elas ficam.`;
  return `A noite convida ao aprofundamento. As melhores análises nascem quando o mundo fica quieto.`;
}

function getDiaSemana() {
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const agora = new Date();
  return `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} - ${agora.getFullYear()}`;
}

export default function AteliêScreen() {
  const [guru, setGuru] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('geral');
  const [carregando, setCarregando] = useState(false);
  const [noticiaExpandida, setNoticiaExpandida] = useState(null);

  const opacidadeGuru = useRef(new Animated.Value(0)).current;
  const translateGuru = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    inicializar();
  }, []);

  useEffect(() => {
    carregarNoticias();
  }, [categoriaSelecionada]);

  async function inicializar() {
    const g = await carregarGuru();
    setGuru(g);
    Animated.parallel([
      Animated.timing(opacidadeGuru, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(translateGuru, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
    carregarNoticias();
  }

  async function carregarNoticias() {
    setCarregando(true);
    try {
      const resultado = await buscarNoticias(categoriaSelecionada, 15);
      setNoticias(resultado);
    } catch (e) {
      console.log('Erro ao carregar notícias:', e);
    }
    setCarregando(false);
  }

  return (
    <Background overlay={0.45}>
    <View style={styles.containerInner}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.headerLogoImg} resizeMode="contain" />
        <Text style={styles.headerData}>{getDiaSemana()}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarNoticias} tintColor={COLORS.accentGold} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloco do Guru */}
        {guru && (
          <Animated.View style={[styles.guruBloco, {
            opacity: opacidadeGuru,
            transform: [{ translateY: translateGuru }],
          }]}>
            {/* Avatar do Guru */}
            <View style={styles.guruRow}>
              <View style={styles.guruAvatar}>
                <Text style={styles.guruAvatarTexto}>
                  {guru.avatar === 'tritongo' ? '🧔' : guru.nome.charAt(0)}
                </Text>
              </View>
              <View style={styles.guruInfo}>
                <Text style={styles.guruNome}>{guru.nome}</Text>
                <Text style={styles.guruTipo}>{guru.tipo}</Text>
              </View>
            </View>

            {/* Balão de fala */}
            <View style={styles.guruBalao}>
              <Text style={styles.guruFrase}>"{getFraseGuru(guru.nome)}"</Text>
            </View>
          </Animated.View>
        )}

        {/* Filtro de categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorias}>
          {CATEGORIAS.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoriaBtn, categoriaSelecionada === cat.id && styles.categoriaBtnAtivo]}
              onPress={() => setCategoriaSelecionada(cat.id)}
            >
              <Text style={styles.categoriaIcone}>{cat.icon}</Text>
              <Text style={[styles.categoriaLabel, categoriaSelecionada === cat.id && styles.categoriaLabelAtiva]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Jornal de notícias */}
        <ImageBackground
          source={require('../../assets/jornal.png')}
          style={styles.jornal}
          imageStyle={{ borderRadius: 16 }}
          resizeMode="stretch"
        >
          <View style={styles.jornalHeader}>
            <Text style={styles.jornalTitulo}>TRITONGO</Text>
            <Text style={styles.jornalSubtitulo}>EDITORIAL · Pré-filtragem IA</Text>
            <View style={styles.jornalDivisor} />
          </View>

          {carregando && noticias.length === 0 ? (
            <Text style={styles.carregandoTexto}>Buscando notícias...</Text>
          ) : noticias.length === 0 ? (
            <Text style={styles.carregandoTexto}>Nenhuma notícia encontrada. Puxe para atualizar.</Text>
          ) : (
            noticias.map((noticia, index) => (
              <TouchableOpacity
                key={noticia.id}
                style={[styles.noticiaItem, index === 0 && styles.noticiaDestaque]}
                onPress={() => setNoticiaExpandida(noticiaExpandida === noticia.id ? null : noticia.id)}
                activeOpacity={0.85}
              >
                <View style={styles.noticiaHeader}>
                  <Text style={styles.noticiaFonte}>{noticia.fonte}</Text>
                  <Text style={styles.noticiaData}>{noticia.data}</Text>
                </View>
                <Text style={[styles.noticiaTitulo, index === 0 && styles.noticiaTituloDestaque]}>
                  {noticia.titulo}
                </Text>
                {(noticiaExpandida === noticia.id || index === 0) && noticia.descricao ? (
                  <Text style={styles.noticiaDescricao}>{noticia.descricao}</Text>
                ) : null}
                {index < noticias.length - 1 && <View style={styles.noticiaDivisor} />}
              </TouchableOpacity>
            ))
          )}
        </ImageBackground>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerInner: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navBorder,
  },
  headerLogo: {
    fontSize: FONTS.lg,
    fontWeight: FONTS.heavy,
    color: COLORS.accent,
    letterSpacing: 2,
  },
  headerData: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  scroll: { flex: 1 },
  guruBloco: {
    margin: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.navBorder,
  },
  guruRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  guruAvatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accentGold,
    marginRight: SPACING.md,
  },
  guruAvatarTexto: { fontSize: 28 },
  guruAvatarImg: { width: 48, height: 48, borderRadius: 24 },
  guruInfo: { flex: 1 },
  guruNome: {
    fontSize: FONTS.md,
    fontWeight: FONTS.bold,
    color: COLORS.accentGold,
  },
  guruTipo: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  guruBalao: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accentGold,
  },
  guruFrase: {
    fontSize: FONTS.md,
    color: COLORS.textDark,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  categorias: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    flexGrow: 0,
  },
  categoriaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.backgroundLight,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.navBorder,
  },
  categoriaBtnAtivo: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoriaIcone: { fontSize: 14, marginRight: 4 },
  categoriaLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.medium,
  },
  categoriaLabelAtiva: { color: COLORS.textLight },
  jornal: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  jornalHeader: { alignItems: 'center', marginBottom: SPACING.md },
  jornalTitulo: {
    fontSize: FONTS.xxl,
    fontWeight: FONTS.heavy,
    color: COLORS.textDark,
    letterSpacing: 3,
  },
  jornalSubtitulo: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  jornalDivisor: {
    height: 1,
    backgroundColor: COLORS.textDark,
    width: '100%',
    marginTop: SPACING.sm,
  },
  carregandoTexto: {
    textAlign: 'center',
    color: COLORS.textMuted,
    padding: SPACING.xl,
    fontStyle: 'italic',
  },
  noticiaItem: { paddingVertical: SPACING.md },
  noticiaDestaque: {
    paddingBottom: SPACING.md,
    marginBottom: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textDark,
  },
  noticiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noticiaFonte: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noticiaData: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  noticiaTitulo: {
    fontSize: FONTS.md,
    fontWeight: FONTS.bold,
    color: COLORS.textDark,
    lineHeight: 21,
  },
  noticiaTituloDestaque: {
    fontSize: FONTS.xl,
    lineHeight: 26,
  },
  noticiaDescricao: {
    fontSize: FONTS.sm,
    color: '#555',
    lineHeight: 19,
    marginTop: SPACING.sm,
  },
  noticiaDivisor: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: SPACING.md,
  },
});
