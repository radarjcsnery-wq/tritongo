// TRITONGO - Mural de Pauta
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Modal, TextInput, Alert, StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import Background from '../components/Background';
import { carregarPautas, salvarPautas, carregarCalendario, salvarCalendario } from '../services/storage';

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const HORARIOS = [
  { id: '08', label: '08:00', icone: '☀️', periodo: 'Manhã' },
  { id: '12', label: '12:00', icone: '🌤️', periodo: 'Meio-dia' },
  { id: '19', label: '19:00', icone: '🌙', periodo: 'Noite' },
];

const STATUS_CONFIG = {
  feito: { cor: COLORS.statusFeito, label: 'Feito', emoji: '🟢' },
  agendado: { cor: COLORS.statusAgendado, label: 'Agendado', emoji: '🔵' },
  pendente: { cor: COLORS.statusPendente, label: 'Pendente', emoji: '🟡' },
};

const TONS = ['Reflexivo', 'Humorístico', 'Analítico', 'Inspirador', 'Educativo', 'Crítico'];
const OBJETIVOS = ['Engajar', 'Informar', 'Conectar', 'Provocar', 'Educar'];

function getDiasDoCalendario() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0=Dom
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(segunda);
    dia.setDate(segunda.getDate() + i);
    const isHoje = dia.toDateString() === hoje.toDateString();
    return {
      label: DIAS_SEMANA[i],
      data: `${String(dia.getDate()).padStart(2, '0')}/${String(dia.getMonth() + 1).padStart(2, '0')}`,
      isHoje,
      key: dia.toISOString().split('T')[0],
    };
  });
}

export default function MuralPautaScreen() {
  const [pautas, setPautas] = useState({ backlog: [], emProducao: [], pronto: [] });
  const [calendario, setCalendario] = useState({});
  const [dias] = useState(getDiasDoCalendario());
  const [modalNovaPauta, setModalNovaPauta] = useState(false);
  const [novaPauta, setNovaPauta] = useState({ titulo: '', tom: 'Reflexivo', objetivo: 'Engajar' });
  const [colunaNova, setColunaNova] = useState('backlog');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const p = await carregarPautas();
    const c = await carregarCalendario();
    setPautas(p);
    setCalendario(c);
  }

  async function adicionarPauta() {
    if (!novaPauta.titulo.trim()) {
      Alert.alert('Atenção', 'Digite um título para a pauta.');
      return;
    }
    const nova = {
      id: Date.now().toString(),
      titulo: novaPauta.titulo.trim(),
      tom: novaPauta.tom,
      objetivo: novaPauta.objetivo,
      criadaEm: new Date().toISOString(),
    };
    const novasPautas = { ...pautas, [colunaNova]: [...pautas[colunaNova], nova] };
    setPautas(novasPautas);
    await salvarPautas(novasPautas);
    setModalNovaPauta(false);
    setNovaPauta({ titulo: '', tom: 'Reflexivo', objetivo: 'Engajar' });
  }

  async function moverPauta(pauta, deColuna, paraColuna) {
    const novasPautas = { ...pautas };
    novasPautas[deColuna] = novasPautas[deColuna].filter(p => p.id !== pauta.id);
    novasPautas[paraColuna] = [...novasPautas[paraColuna], pauta];
    setPautas(novasPautas);
    await salvarPautas(novasPautas);
  }

  async function alterarStatusCalendario(diaKey, horarioId) {
    const chave = `${diaKey}_${horarioId}`;
    const statusAtual = calendario[chave]?.status || 'pendente';
    const proximo = statusAtual === 'pendente' ? 'agendado' : statusAtual === 'agendado' ? 'feito' : 'pendente';
    const novoCalendario = { ...calendario, [chave]: { ...(calendario[chave] || {}), status: proximo } };
    setCalendario(novoCalendario);
    await salvarCalendario(novoCalendario);
  }

  function CartaoKanban({ pauta, coluna }) {
    const proxima = coluna === 'backlog' ? 'emProducao' : coluna === 'emProducao' ? 'pronto' : null;
    const label = coluna === 'backlog' ? 'Em produção →' : coluna === 'emProducao' ? 'Aprovar →' : null;

    return (
      <View style={styles.cartao}>
        <Text style={styles.cartaoTitulo}>{pauta.titulo}</Text>
        <View style={styles.cartaoTags}>
          <View style={styles.tag}><Text style={styles.tagTexto}>{pauta.tom}</Text></View>
          <View style={styles.tag}><Text style={styles.tagTexto}>{pauta.objetivo}</Text></View>
        </View>
        {proxima && (
          <TouchableOpacity style={styles.cartaoBotao} onPress={() => moverPauta(pauta, coluna, proxima)}>
            <Text style={styles.cartaoBotaoTexto}>{label}</Text>
          </TouchableOpacity>
        )}
        {coluna === 'pronto' && (
          <View style={styles.cartaoPronto}>
            <Text style={styles.cartaoProntoTexto}>✅ Pronto para agendar</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.headerLogoImg} resizeMode="contain" />
        <Text style={styles.headerData}>{dias.find(d => d.isHoje)?.data || ''}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.bloco}>
          {/* Título */}
          <Text style={styles.tituloPagina}>MURAL DE PAUTA</Text>
          <Text style={styles.subtituloPagina}>Planeje, organize e publique com propósito.</Text>
          <View style={styles.divisorPrincipal} />

          {/* Calendário Semanal */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>📅 CALENDÁRIO SEMANAL</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Cabeçalho dos dias */}
              <View style={styles.calRow}>
                <View style={styles.calCelHora} />
                {dias.map(dia => (
                  <View key={dia.key} style={[styles.calCelDia, dia.isHoje && styles.calCelDiaHoje]}>
                    <Text style={[styles.calDiaLabel, dia.isHoje && styles.calDiaLabelHoje]}>{dia.label}</Text>
                    <Text style={[styles.calDiaData, dia.isHoje && styles.calDiaDataHoje]}>{dia.data}</Text>
                  </View>
                ))}
              </View>

              {/* Linhas de horário */}
              {HORARIOS.map(horario => (
                <View key={horario.id} style={styles.calRow}>
                  <View style={styles.calCelHora}>
                    <Text style={styles.calHoraIcone}>{horario.icone}</Text>
                    <Text style={styles.calHoraLabel}>{horario.label}</Text>
                    <Text style={styles.calHoraPeriodo}>{horario.periodo}</Text>
                  </View>
                  {dias.map(dia => {
                    const chave = `${dia.key}_${horario.id}`;
                    const slot = calendario[chave] || {};
                    const status = slot.status || 'pendente';
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <TouchableOpacity
                        key={dia.key}
                        style={[styles.calCelSlot, dia.isHoje && styles.calCelSlotHoje]}
                        onPress={() => alterarStatusCalendario(dia.key, horario.id)}
                      >
                        <View style={[styles.statusDot, { backgroundColor: cfg.cor }]} />
                        <Text style={styles.slotTexto}>{slot.titulo || 'Slot livre'}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Legenda */}
          <View style={styles.legenda}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <View key={key} style={styles.legendaItem}>
                <Text style={styles.legendaEmoji}>{cfg.emoji}</Text>
                <Text style={styles.legendaLabel}>{cfg.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divisorPrincipal} />

          {/* Kanban */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>📋 KANBAN DE PRODUÇÃO</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kanban}>
            {/* Backlog */}
            <View style={styles.kanbanColuna}>
              <View style={[styles.kanbanHeader, { backgroundColor: '#6A1B9A' }]}>
                <Text style={styles.kanbanHeaderTexto}>💡 BACKLOG / IDEIAS</Text>
              </View>
              <ScrollView style={styles.kanbanScroll} nestedScrollEnabled>
                {pautas.backlog.map(p => <CartaoKanban key={p.id} pauta={p} coluna="backlog" />)}
              </ScrollView>
              <TouchableOpacity style={styles.kanbanAdicionar} onPress={() => { setColunaNova('backlog'); setModalNovaPauta(true); }}>
                <Text style={styles.kanbanAdicionarTexto}>+ Nova ideia</Text>
              </TouchableOpacity>
            </View>

            {/* Em Produção */}
            <View style={styles.kanbanColuna}>
              <View style={[styles.kanbanHeader, { backgroundColor: '#E65100' }]}>
                <Text style={styles.kanbanHeaderTexto}>✏️ EM PRODUÇÃO</Text>
              </View>
              <ScrollView style={styles.kanbanScroll} nestedScrollEnabled>
                {pautas.emProducao.map(p => <CartaoKanban key={p.id} pauta={p} coluna="emProducao" />)}
              </ScrollView>
              <TouchableOpacity style={styles.kanbanAdicionar} onPress={() => { setColunaNova('emProducao'); setModalNovaPauta(true); }}>
                <Text style={styles.kanbanAdicionarTexto}>+ Adicionar pauta</Text>
              </TouchableOpacity>
            </View>

            {/* Pronto */}
            <View style={styles.kanbanColuna}>
              <View style={[styles.kanbanHeader, { backgroundColor: '#2E7D32' }]}>
                <Text style={styles.kanbanHeaderTexto}>✅ PRONTO</Text>
              </View>
              <ScrollView style={styles.kanbanScroll} nestedScrollEnabled>
                {pautas.pronto.map(p => <CartaoKanban key={p.id} pauta={p} coluna="pronto" />)}
              </ScrollView>
              <TouchableOpacity style={[styles.kanbanAdicionar, { borderColor: '#2E7D32' }]}>
                <Text style={[styles.kanbanAdicionarTexto, { color: '#2E7D32' }]}>+ Enviar para Studio</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal Nova Pauta */}
      <Modal visible={modalNovaPauta} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Nova Pauta</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Título da pauta..."
              placeholderTextColor={COLORS.textMuted}
              value={novaPauta.titulo}
              onChangeText={t => setNovaPauta(prev => ({ ...prev, titulo: t }))}
              multiline
            />
            <Text style={styles.modalLabel}>Tom de voz</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TONS.map(tom => (
                <TouchableOpacity key={tom} style={[styles.opcaoPilula, novaPauta.tom === tom && styles.opcaoPilulaAtiva]}
                  onPress={() => setNovaPauta(prev => ({ ...prev, tom }))}>
                  <Text style={[styles.opcaoPilulaTexto, novaPauta.tom === tom && styles.opcaoPilulaTextoAtivo]}>{tom}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.modalLabel}>Objetivo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {OBJETIVOS.map(obj => (
                <TouchableOpacity key={obj} style={[styles.opcaoPilula, novaPauta.objetivo === obj && styles.opcaoPilulaAtiva]}
                  onPress={() => setNovaPauta(prev => ({ ...prev, objetivo: obj }))}>
                  <Text style={[styles.opcaoPilulaTexto, novaPauta.objetivo === obj && styles.opcaoPilulaTextoAtivo]}>{obj}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setModalNovaPauta(false)}>
                <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBotaoSalvar} onPress={adicionarPauta}>
                <Text style={styles.modalBotaoSalvarTexto}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundMid },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl + 8, paddingBottom: SPACING.md,
    backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.navBorder,
  },
  headerLogoImg: { width: 40, height: 40, marginRight: SPACING.sm },
  headerLogo: { fontSize: FONTS.lg, fontWeight: FONTS.heavy, color: COLORS.accent, letterSpacing: 2 },
  headerData: { fontSize: FONTS.xs, color: COLORS.textMuted },
  scroll: { flex: 1 },
  bloco: { margin: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  tituloPagina: { fontSize: FONTS.xxxl, fontWeight: FONTS.heavy, color: COLORS.textDark, textAlign: 'center', letterSpacing: 2 },
  subtituloPagina: { fontSize: FONTS.sm, color: COLORS.textMuted, textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  divisorPrincipal: { height: 1, backgroundColor: '#ccc', marginVertical: SPACING.lg },
  secaoHeader: { marginBottom: SPACING.md },
  secaoTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.bold, color: COLORS.textDark, letterSpacing: 1 },
  // Calendário
  calRow: { flexDirection: 'row' },
  calCelHora: { width: 64, padding: SPACING.sm, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#ddd' },
  calHoraIcone: { fontSize: 14 },
  calHoraLabel: { fontSize: 10, fontWeight: FONTS.bold, color: COLORS.textDark },
  calHoraPeriodo: { fontSize: 9, color: COLORS.textMuted },
  calCelDia: { width: 80, padding: SPACING.sm, alignItems: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f7f2' },
  calCelDiaHoje: { backgroundColor: COLORS.accent },
  calDiaLabel: { fontSize: 10, fontWeight: FONTS.bold, color: COLORS.textMuted },
  calDiaLabelHoje: { color: '#fff' },
  calDiaData: { fontSize: 11, color: COLORS.textDark, marginTop: 2 },
  calDiaDataHoje: { color: '#fff' },
  calCelSlot: { width: 80, padding: SPACING.sm, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#ddd', minHeight: 56, justifyContent: 'center' },
  calCelSlotHoje: { backgroundColor: '#fff8f0' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 3 },
  slotTexto: { fontSize: 9, color: COLORS.textMuted, lineHeight: 12 },
  legenda: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md, gap: SPACING.lg },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendaEmoji: { fontSize: 12 },
  legendaLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  // Kanban
  kanban: { marginHorizontal: -SPACING.sm },
  kanbanColuna: { width: 200, marginHorizontal: SPACING.sm },
  kanbanHeader: { borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.sm },
  kanbanHeaderTexto: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: '#fff', textAlign: 'center' },
  kanbanScroll: { maxHeight: 280 },
  kanbanAdicionar: { borderWidth: 1, borderColor: COLORS.textMuted, borderStyle: 'dashed', borderRadius: RADIUS.sm, padding: SPACING.sm, alignItems: 'center', marginTop: SPACING.sm },
  kanbanAdicionarTexto: { fontSize: FONTS.sm, color: COLORS.textMuted },
  cartao: { backgroundColor: '#fff', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#e8e8e8' },
  cartaoTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.semibold, color: COLORS.textDark, lineHeight: 18 },
  cartaoTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: SPACING.sm },
  tag: { backgroundColor: '#f0f0f0', borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2 },
  tagTexto: { fontSize: 10, color: '#555' },
  cartaoBotao: { marginTop: SPACING.sm, backgroundColor: COLORS.backgroundMid, borderRadius: RADIUS.sm, padding: 6, alignItems: 'center' },
  cartaoBotaoTexto: { fontSize: 10, color: COLORS.accentGold, fontWeight: FONTS.bold },
  cartaoPronto: { marginTop: SPACING.sm },
  cartaoProntoTexto: { fontSize: 10, color: COLORS.statusFeito, fontWeight: FONTS.bold },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl },
  modalTitulo: { fontSize: FONTS.xl, fontWeight: FONTS.bold, color: COLORS.textDark, marginBottom: SPACING.lg },
  modalInput: { backgroundColor: '#f0ede6', borderRadius: RADIUS.md, padding: SPACING.md, fontSize: FONTS.md, color: COLORS.textDark, marginBottom: SPACING.lg, minHeight: 80, textAlignVertical: 'top' },
  modalLabel: { fontSize: FONTS.sm, fontWeight: FONTS.bold, color: COLORS.textMuted, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1 },
  opcaoPilula: { borderWidth: 1, borderColor: '#ccc', borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: 6, marginRight: SPACING.sm, marginBottom: SPACING.lg },
  opcaoPilulaAtiva: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  opcaoPilulaTexto: { fontSize: FONTS.sm, color: COLORS.textMuted },
  opcaoPilulaTextoAtivo: { color: '#fff', fontWeight: FONTS.bold },
  modalBotoes: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  modalBotaoCancelar: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  modalBotaoCancelarTexto: { fontSize: FONTS.md, color: COLORS.textMuted },
  modalBotaoSalvar: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.accent, alignItems: 'center' },
  modalBotaoSalvarTexto: { fontSize: FONTS.md, color: '#fff', fontWeight: FONTS.bold },
});
