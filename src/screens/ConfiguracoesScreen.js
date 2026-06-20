// TRITONGO - Configurações
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, Alert, StatusBar, Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import Background from '../components/Background';
import { carregarGuru, salvarGuru } from '../services/storage';

const PERSONALIDADES = [
  { id: 'filosofo', label: '🧠 Filósofo', desc: 'Reflexivo e profundo' },
  { id: 'psicologo', label: '💙 Psicólogo', desc: 'Acolhedor e empático' },
  { id: 'humorista', label: '😄 Humorista', desc: 'Leve e bem-humorado' },
  { id: 'jornalista', label: '📰 Jornalista', desc: 'Direto e informativo' },
  { id: 'mentor', label: '⭐ Mentor', desc: 'Inspirador e motivador' },
];

export default function ConfiguracoesScreen() {
  const [guru, setGuru] = useState(null);
  const [nomeEditando, setNomeEditando] = useState('');
  const [tipoEditando, setTipoEditando] = useState('');
  const [personalidadeEditando, setPersonalidadeEditando] = useState('filosofo');
  const [notificacoes, setNotificacoes] = useState(true);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const g = await carregarGuru();
    setGuru(g);
    setNomeEditando(g.nome);
    setTipoEditando(g.tipo);
    setPersonalidadeEditando(g.personalidade || 'filosofo');
  }

  async function salvar() {
    const guruAtualizado = {
      ...guru,
      nome: nomeEditando.trim() || 'TRITONGO',
      tipo: tipoEditando.trim() || 'Companheiro Editorial',
      personalidade: personalidadeEditando,
    };
    await salvarGuru(guruAtualizado);
    setGuru(guruAtualizado);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  function resetarGuru() {
    Alert.alert(
      'Resetar Guru',
      'Voltar ao Guru padrão TRITONGO?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar', style: 'destructive', onPress: async () => {
            const padrao = { nome: 'TRITONGO', tipo: 'Companheiro Editorial', personalidade: 'filosofo', avatar: 'tritongo', fraseBoasVindas: 'Seu companheiro editorial está aqui.' };
            await salvarGuru(padrao);
            setGuru(padrao);
            setNomeEditando(padrao.nome);
            setTipoEditando(padrao.tipo);
            setPersonalidadeEditando(padrao.personalidade);
          }
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.headerLogoImg} resizeMode="contain" />
        <Text style={styles.headerSub}>Configurações</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Seção Guru */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>🧔 SEU GURU</Text>

          {/* Preview do Guru */}
          {guru && (
            <View style={styles.guruPreview}>
              <View style={styles.guruAvatar}>
                <Text style={styles.guruAvatarTexto}>
                  {guru.avatar === 'tritongo' ? '🧔' : guru.nome.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.guruNome}>{guru.nome}</Text>
                <Text style={styles.guruTipo}>{guru.tipo}</Text>
              </View>
            </View>
          )}

          <Text style={styles.campo}>Nome do Guru</Text>
          <TextInput
            style={styles.input}
            value={nomeEditando}
            onChangeText={setNomeEditando}
            placeholder="Ex: Professor Silva, Luna, Avô João..."
            placeholderTextColor={COLORS.textMuted}
            maxLength={30}
          />

          <Text style={styles.campo}>Descrição / Papel</Text>
          <TextInput
            style={styles.input}
            value={tipoEditando}
            onChangeText={setTipoEditando}
            placeholder="Ex: Minha avó sábia, Meu cachorro Thor..."
            placeholderTextColor={COLORS.textMuted}
            maxLength={40}
          />

          <Text style={styles.campo}>Personalidade</Text>
          {PERSONALIDADES.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.personalidadeOpcao, personalidadeEditando === p.id && styles.personalidadeOpcaoAtiva]}
              onPress={() => setPersonalidadeEditando(p.id)}
            >
              <Text style={styles.personalidadeLabel}>{p.label}</Text>
              <Text style={styles.personalidadeDesc}>{p.desc}</Text>
              {personalidadeEditando === p.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
            <Text style={styles.botaoSalvarTexto}>
              {salvo ? '✓ Salvo!' : 'Salvar Guru'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoResetar} onPress={resetarGuru}>
            <Text style={styles.botaoResetarTexto}>Resetar para TRITONGO padrão</Text>
          </TouchableOpacity>
        </View>

        {/* Seção Notificações */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>🔔 PREFERÊNCIAS</Text>

          <View style={styles.preferencia}>
            <View>
              <Text style={styles.preferenciaLabel}>Lembretes de postagem</Text>
              <Text style={styles.preferenciaDesc}>Notificações nos horários do Mural</Text>
            </View>
            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              trackColor={{ false: COLORS.navBorder, true: COLORS.accent }}
              thumbColor={COLORS.textLight}
            />
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>ℹ️ SOBRE</Text>
          <View style={styles.sobreCard}>
            <Text style={styles.sobreNome}>TRITONGO</Text>
            <Text style={styles.sobreVersao}>Versão 1.0.0</Text>
            <Text style={styles.sobreDesc}>Plataforma Editorial Inteligente para Microblogs</Text>
            <Text style={styles.sobreAmbientes}>Ateliê · Mural de Pauta · Studio</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundMid },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl + 8, paddingBottom: SPACING.md, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.navBorder },
  headerLogoImg: { width: 40, height: 40, marginRight: SPACING.sm },
  headerLogo: { fontSize: FONTS.lg, fontWeight: FONTS.heavy, color: COLORS.accent, letterSpacing: 2 },
  headerSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  scroll: { flex: 1 },
  secao: { margin: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  secaoTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.bold, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.lg },
  guruPreview: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.backgroundLight, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  guruAvatar: { width: 48, height: 48, borderRadius: RADIUS.round, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.accentGold },
  guruAvatarTexto: { fontSize: 26 },
  guruAvatarImg: { width: 44, height: 44, borderRadius: 22 },
  guruNome: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: COLORS.accentGold },
  guruTipo: { fontSize: FONTS.xs, color: COLORS.textMuted },
  campo: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: '#f0ede6', borderRadius: RADIUS.md, padding: SPACING.md, fontSize: FONTS.md, color: COLORS.textDark, borderWidth: 1, borderColor: '#ddd', marginBottom: SPACING.sm },
  personalidadeOpcao: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: SPACING.sm, backgroundColor: '#fafaf8' },
  personalidadeOpcaoAtiva: { borderColor: COLORS.accent, backgroundColor: '#fff5f5' },
  personalidadeLabel: { fontSize: FONTS.md, fontWeight: FONTS.semibold, color: COLORS.textDark, flex: 1 },
  personalidadeDesc: { fontSize: FONTS.xs, color: COLORS.textMuted, marginRight: SPACING.sm },
  checkmark: { fontSize: 16, color: COLORS.accent, fontWeight: FONTS.bold },
  botaoSalvar: { backgroundColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  botaoSalvarTexto: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: '#fff' },
  botaoResetar: { padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  botaoResetarTexto: { fontSize: FONTS.sm, color: COLORS.textMuted },
  preferencia: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  preferenciaLabel: { fontSize: FONTS.md, color: COLORS.textDark, fontWeight: FONTS.medium },
  preferenciaDesc: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  sobreCard: { alignItems: 'center', padding: SPACING.lg },
  sobreNome: { fontSize: FONTS.xxl, fontWeight: FONTS.heavy, color: COLORS.accent, letterSpacing: 3 },
  sobreVersao: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 4 },
  sobreDesc: { fontSize: FONTS.sm, color: COLORS.textDark, textAlign: 'center', marginTop: SPACING.md, fontStyle: 'italic' },
  sobreAmbientes: { fontSize: FONTS.sm, color: COLORS.textMuted, marginTop: SPACING.sm },
});
