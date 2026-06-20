// TRITONGO - Studio (IA + Busca + Geração de texto)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, ActivityIndicator, Alert, Clipboard, StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import Background from '../components/Background';
import { buscarNoticias, CATEGORIAS } from '../services/rss';

const TONS_VOZ = [
  { id: 'reflexivo', label: 'Reflexivo', desc: 'Profundo, instigante e conectado com o leitor.' },
  { id: 'humoristico', label: 'Humorístico', desc: 'Leve, irônico e com bom humor inteligente.' },
  { id: 'analitico', label: 'Analítico', desc: 'Preciso, objetivo e baseado em fatos.' },
  { id: 'inspirador', label: 'Inspirador', desc: 'Motivador, esperançoso e transformador.' },
  { id: 'critico', label: 'Crítico', desc: 'Questionador, direto e provocativo.' },
];

const FORMATOS = [
  { id: 'microblog', label: 'Microblog', desc: 'Texto curto, direto e impactante.' },
  { id: 'thread', label: 'Thread', desc: 'Sequência de 3 a 5 posts encadeados.' },
  { id: 'resenha', label: 'Resenha', desc: 'Análise crítica com opinião do autor.' },
  { id: 'satira', label: 'Sátira', desc: 'Versão humorística e irônica da notícia.' },
];

const OBJETIVOS = [
  { id: 'engajar', label: 'Engajar' },
  { id: 'informar', label: 'Informar' },
  { id: 'provocar', label: 'Provocar reflexão' },
  { id: 'conectar', label: 'Conectar' },
];

// Gerador de texto simulado (substituir por API de IA real)
function gerarTextoSimulado(noticia, tom, formato, objetivo) {
  const aberturas = {
    reflexivo: 'Enquanto o mundo acelera, essa notícia nos convida a pausar e pensar.',
    humoristico: 'Olha, eu não sei vocês, mas essa notícia me fez parar o café no meio do caminho.',
    analitico: 'Os dados não mentem. Veja o que essa informação revela na prática.',
    inspirador: 'Por trás de cada notícia difícil existe uma lição que nos torna mais fortes.',
    critico: 'Vamos direto ao ponto. Essa notícia levanta questões que não podem ser ignoradas.',
  };

  const fechamentos = {
    engajar: '\n\nE você, o que pensa sobre isso? Comente abaixo. 👇',
    informar: '\n\nInformação é poder. Compartilhe com quem precisa saber.',
    provocar: '\n\nA pergunta fica: até quando vamos aceitar isso sem questionar?',
    conectar: '\n\nSomos mais do que espectadores. Somos parte dessa história.',
  };

  const abertura = aberturas[tom] || aberturas.reflexivo;
  const fechamento = fechamentos[objetivo] || '';

  if (formato === 'satira') {
    return `🎭 VERSÃO SATÍRICA:\n\n${noticia.titulo}\n\nTraduzindo para o português claro: alguém, em algum lugar, achou uma ideia genial — e aqui estamos todos nós lidando com as consequências.\n\nMas respira. Sempre foi assim e vamos sobreviver.${fechamento}`;
  }

  if (formato === 'thread') {
    return `🧵 THREAD (1/3)\n${abertura}\n\n📌 (2/3)\n${noticia.titulo}\n\n${noticia.descricao || 'O contexto é mais amplo do que parece à primeira vista.'}\n\n💬 (3/3)\nO que isso significa para nós?${fechamento}`;
  }

  return `${abertura}\n\n${noticia.titulo}\n\n${noticia.descricao || 'Uma história que merece nossa atenção e reflexão.'}${fechamento}`;
}

export default function StudioScreen() {
  const [etapa, setEtapa] = useState(1); // 1=criterio, 2=garimpo, 3=redacao
  const [categoria, setCategoria] = useState('geral');
  const [tom, setTom] = useState('reflexivo');
  const [formato, setFormato] = useState('microblog');
  const [objetivo, setObjetivo] = useState('engajar');
  const [noticias, setNoticias] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [textoGerado, setTextoGerado] = useState('');
  const [gerando, setGerando] = useState(false);

  async function buscar() {
    setCarregando(true);
    setEtapa(2);
    try {
      const resultado = await buscarNoticias(categoria, 8);
      setNoticias(resultado);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar notícias. Verifique sua conexão.');
    }
    setCarregando(false);
  }

  function toggleSelecionada(noticia) {
    setSelecionadas(prev => {
      const existe = prev.find(n => n.id === noticia.id);
      if (existe) return prev.filter(n => n.id !== noticia.id);
      if (prev.length >= 3) {
        Alert.alert('Máximo', 'Selecione até 3 notícias para curadoria.');
        return prev;
      }
      return [...prev, noticia];
    });
  }

  async function gerarTexto() {
    if (selecionadas.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos uma notícia na curadoria.');
      return;
    }
    setGerando(true);
    setEtapa(3);
    await new Promise(r => setTimeout(r, 1500)); // simula processamento
    const textoFinal = gerarTextoSimulado(selecionadas[0], tom, formato, objetivo);
    setTextoGerado(textoFinal);
    setGerando(false);
  }

  function copiarTexto() {
    Clipboard.setString(textoGerado);
    Alert.alert('Copiado!', 'Texto copiado para a área de transferência.');
  }

  function reiniciar() {
    setEtapa(1);
    setNoticias([]);
    setSelecionadas([]);
    setTextoGerado('');
  }

  const tomSelecionado = TONS_VOZ.find(t => t.id === tom);
  const formatoSelecionado = FORMATOS.find(f => f.id === formato);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.headerLogoImg} resizeMode="contain" />
        <TouchableOpacity onPress={reiniciar}>
          <Text style={styles.headerReiniciar}>↺ Reiniciar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.bloco}>
          {/* Título */}
          <View style={styles.tituloRow}>
            <Text style={styles.tituloPagina}>✦ STUDIO</Text>
          </View>
          <Text style={styles.subtituloPagina}>Tecnologia para transformar informação em conexão.</Text>
          <View style={styles.divisor} />

          {/* Indicador de etapas */}
          <View style={styles.etapas}>
            {[
              { n: 1, label: 'Defina o\nCritério' },
              { n: 2, label: 'IA Garimpа\nNotícias' },
              { n: 3, label: 'Gere no\nSeu Tom' },
            ].map((e, i) => (
              <View key={e.n} style={styles.etapaWrapper}>
                <View style={[styles.etapaBolha, etapa >= e.n && styles.etapaBolhaAtiva]}>
                  <Text style={[styles.etapaNumero, etapa >= e.n && styles.etapaNumeroAtivo]}>{e.n}</Text>
                </View>
                <Text style={[styles.etapaLabel, etapa >= e.n && styles.etapaLabelAtivo]}>{e.label}</Text>
                {i < 2 && <View style={[styles.etapaLinha, etapa > e.n && styles.etapaLinhaAtiva]} />}
              </View>
            ))}
          </View>

          <View style={styles.divisor} />

          {/* ETAPA 1 — Critério */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>🎯 CRITÉRIO DE BUSCA</Text>

            <Text style={styles.campo}>Tema principal</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opcoes}>
              {CATEGORIAS.map(cat => (
                <TouchableOpacity key={cat.id} style={[styles.pilula, categoria === cat.id && styles.pilulaAtiva]}
                  onPress={() => setCategoria(cat.id)}>
                  <Text style={styles.pilulaIcone}>{cat.icon}</Text>
                  <Text style={[styles.pilulaTexto, categoria === cat.id && styles.pilulaTextoAtivo]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.campo}>Tom de voz</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opcoes}>
              {TONS_VOZ.map(t => (
                <TouchableOpacity key={t.id} style={[styles.pilula, tom === t.id && styles.pilulaAtiva]}
                  onPress={() => setTom(t.id)}>
                  <Text style={[styles.pilulaTexto, tom === t.id && styles.pilulaTextoAtivo]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {tomSelecionado && <Text style={styles.descCampo}>{tomSelecionado.desc}</Text>}

            <Text style={styles.campo}>Formato</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opcoes}>
              {FORMATOS.map(f => (
                <TouchableOpacity key={f.id} style={[styles.pilula, formato === f.id && styles.pilulaAtiva]}
                  onPress={() => setFormato(f.id)}>
                  <Text style={[styles.pilulaTexto, formato === f.id && styles.pilulaTextoAtivo]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {formatoSelecionado && <Text style={styles.descCampo}>{formatoSelecionado.desc}</Text>}

            <Text style={styles.campo}>Objetivo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opcoes}>
              {OBJETIVOS.map(o => (
                <TouchableOpacity key={o.id} style={[styles.pilula, objetivo === o.id && styles.pilulaAtiva]}
                  onPress={() => setObjetivo(o.id)}>
                  <Text style={[styles.pilulaTexto, objetivo === o.id && styles.pilulaTextoAtivo]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.botaoBuscar} onPress={buscar} disabled={carregando}>
              {carregando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.botaoBuscarTexto}>⚡ Buscar com IA</Text>
              }
            </TouchableOpacity>
          </View>

          {/* ETAPA 2 — Garimpo */}
          {(etapa >= 2 && noticias.length > 0) && (
            <>
              <View style={styles.divisor} />
              <View style={styles.secao}>
                <View style={styles.secaoHeaderRow}>
                  <Text style={styles.secaoTitulo}>1 GARIMPO</Text>
                  <Text style={styles.secaoSub}>{noticias.length} resultados</Text>
                </View>
                {noticias.map(noticia => {
                  const isSelecionada = selecionadas.find(n => n.id === noticia.id);
                  return (
                    <TouchableOpacity key={noticia.id}
                      style={[styles.noticiaCard, isSelecionada && styles.noticiaCardSelecionada]}
                      onPress={() => toggleSelecionada(noticia)}>
                      <View style={styles.noticiaCardHeader}>
                        <Text style={styles.noticiaFonte}>{noticia.fonte}</Text>
                        <Text style={styles.noticiaData}>{noticia.data}</Text>
                        {isSelecionada && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={styles.noticiaTitulo}>{noticia.titulo}</Text>
                      {noticia.descricao ? <Text style={styles.noticiaDesc} numberOfLines={2}>{noticia.descricao}</Text> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* CURADORIA */}
              {selecionadas.length > 0 && (
                <>
                  <View style={styles.secao}>
                    <View style={styles.secaoHeaderRow}>
                      <Text style={styles.secaoTitulo}>2 CURADORIA</Text>
                      <Text style={styles.secaoSub}>{selecionadas.length} selecionadas</Text>
                    </View>
                    {selecionadas.map((n, i) => (
                      <View key={n.id} style={styles.curadoriaCarte}>
                        <Text style={styles.curadoriaNum}>{i + 1}</Text>
                        <View style={styles.curadoriaInfo}>
                          <Text style={styles.curadoriaTitulo}>{n.titulo}</Text>
                          <Text style={styles.curadoriaFonte}>{n.fonte}</Text>
                        </View>
                      </View>
                    ))}
                    <TouchableOpacity style={styles.botaoGerar} onPress={gerarTexto} disabled={gerando}>
                      {gerando
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.botaoGerarTexto}>✍️ Gerar no meu tom</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}

          {/* ETAPA 3 — Redação */}
          {(etapa >= 3 && textoGerado) && (
            <>
              <View style={styles.divisor} />
              <View style={styles.secao}>
                <View style={styles.secaoHeaderRow}>
                  <Text style={styles.secaoTitulo}>3 REDAÇÃO</Text>
                  <TouchableOpacity onPress={copiarTexto}>
                    <Text style={styles.copiarBtn}>📋 Copiar</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.secaoSub}>O microblog final.</Text>

                <View style={styles.preview}>
                  <Text style={styles.previewLabel}>PRÉVIA DO TEXTO</Text>
                  <Text style={styles.previewTexto}>{textoGerado}</Text>
                </View>

                {/* Folha de orientação */}
                <View style={styles.folha}>
                  <Text style={styles.folhaLabel}>FOLHA DE ORIENTAÇÃO</Text>
                  {[
                    ['Tom de voz', TONS_VOZ.find(t => t.id === tom)?.label],
                    ['Objetivo', OBJETIVOS.find(o => o.id === objetivo)?.label],
                    ['Formato', FORMATOS.find(f => f.id === formato)?.label],
                  ].map(([k, v]) => (
                    <View key={k} style={styles.folhaLinha}>
                      <Text style={styles.folhaChave}>{k}</Text>
                      <Text style={styles.folhaValor}>{v}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.botaoEnviar} onPress={copiarTexto}>
                  <Text style={styles.botaoEnviarTexto}>🚀 Enviar para o Mural</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundMid },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl + 8, paddingBottom: SPACING.md, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.navBorder },
  headerLogoImg: { width: 40, height: 40, marginRight: SPACING.sm },
  headerLogo: { fontSize: FONTS.lg, fontWeight: FONTS.heavy, color: COLORS.accent, letterSpacing: 2 },
  headerReiniciar: { fontSize: FONTS.sm, color: COLORS.accentGold },
  scroll: { flex: 1 },
  bloco: { margin: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  tituloRow: { flexDirection: 'row', alignItems: 'center' },
  tituloPagina: { fontSize: FONTS.xxxl, fontWeight: FONTS.heavy, color: COLORS.textDark, letterSpacing: 2 },
  subtituloPagina: { fontSize: FONTS.sm, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 4 },
  divisor: { height: 1, backgroundColor: '#ccc', marginVertical: SPACING.lg },
  etapas: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: SPACING.sm },
  etapaWrapper: { flex: 1, alignItems: 'center', position: 'relative' },
  etapaBolha: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  etapaBolhaAtiva: { backgroundColor: COLORS.textDark },
  etapaNumero: { fontSize: FONTS.sm, fontWeight: FONTS.bold, color: '#aaa' },
  etapaNumeroAtivo: { color: '#fff' },
  etapaLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center', lineHeight: 12 },
  etapaLabelAtivo: { color: COLORS.textDark, fontWeight: FONTS.semibold },
  etapaLinha: { position: 'absolute', top: 15, right: -'50%', width: '100%', height: 1, backgroundColor: '#e0e0e0', zIndex: -1 },
  etapaLinhaAtiva: { backgroundColor: COLORS.textDark },
  secao: { marginBottom: SPACING.sm },
  secaoTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.bold, color: COLORS.textDark, letterSpacing: 1, marginBottom: SPACING.md },
  secaoHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  secaoSub: { fontSize: FONTS.xs, color: COLORS.textMuted, fontStyle: 'italic' },
  campo: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md },
  descCampo: { fontSize: FONTS.xs, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: SPACING.sm },
  opcoes: { flexGrow: 0, marginBottom: SPACING.sm },
  pilula: { borderWidth: 1, borderColor: '#ccc', borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: 6, marginRight: SPACING.sm, flexDirection: 'row', alignItems: 'center', gap: 4 },
  pilulaAtiva: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
  pilulaIcone: { fontSize: 12 },
  pilulaTexto: { fontSize: FONTS.sm, color: COLORS.textMuted },
  pilulaTextoAtivo: { color: '#fff', fontWeight: FONTS.semibold },
  botaoBuscar: { backgroundColor: COLORS.textDark, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  botaoBuscarTexto: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: '#fff' },
  noticiaCard: { backgroundColor: '#f9f7f2', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#e8e8e8' },
  noticiaCardSelecionada: { borderColor: COLORS.accent, backgroundColor: '#fff5f5' },
  noticiaCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  noticiaFonte: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: COLORS.textMuted, textTransform: 'uppercase' },
  noticiaData: { fontSize: FONTS.xs, color: COLORS.textMuted },
  checkmark: { fontSize: 14, color: COLORS.accent, fontWeight: FONTS.bold },
  noticiaTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.semibold, color: COLORS.textDark, lineHeight: 18 },
  noticiaDesc: { fontSize: FONTS.xs, color: '#777', marginTop: 4, lineHeight: 16 },
  curadoriaCarte: { flexDirection: 'row', backgroundColor: '#f0ede6', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'flex-start', gap: SPACING.sm },
  curadoriaNum: { fontSize: FONTS.xl, fontWeight: FONTS.heavy, color: COLORS.textMuted, lineHeight: 26 },
  curadoriaInfo: { flex: 1 },
  curadoriaTitulo: { fontSize: FONTS.sm, fontWeight: FONTS.semibold, color: COLORS.textDark, lineHeight: 17 },
  curadoriaFonte: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  botaoGerar: { backgroundColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  botaoGerarTexto: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: '#fff' },
  preview: { backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: SPACING.md },
  previewLabel: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  previewTexto: { fontSize: FONTS.md, color: COLORS.textDark, lineHeight: 22 },
  folha: { backgroundColor: '#f9f7f2', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  folhaLabel: { fontSize: FONTS.xs, fontWeight: FONTS.bold, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  folhaLinha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  folhaChave: { fontSize: FONTS.sm, color: COLORS.textMuted },
  folhaValor: { fontSize: FONTS.sm, fontWeight: FONTS.semibold, color: COLORS.textDark },
  copiarBtn: { fontSize: FONTS.sm, color: COLORS.accent },
  botaoEnviar: { backgroundColor: COLORS.textDark, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  botaoEnviarTexto: { fontSize: FONTS.md, fontWeight: FONTS.bold, color: '#fff' },
});
