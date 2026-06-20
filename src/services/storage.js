// TRITONGO - Serviço de armazenamento local
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACESSO_LIBERADO: '@tritongo:acesso',
  GURU: '@tritongo:guru',
  PAUTAS: '@tritongo:pautas',
  CALENDARIO: '@tritongo:calendario',
};

// SENHA DE ACESSO — altere aqui para cada lote de distribuição
export const SENHA_LOTE = 'TRITONGO2026';

export async function verificarAcesso() {
  const valor = await AsyncStorage.getItem(KEYS.ACESSO_LIBERADO);
  return valor === 'true';
}

export async function liberarAcesso() {
  await AsyncStorage.setItem(KEYS.ACESSO_LIBERADO, 'true');
}

// GURU
export async function salvarGuru(guru) {
  await AsyncStorage.setItem(KEYS.GURU, JSON.stringify(guru));
}

export async function carregarGuru() {
  const valor = await AsyncStorage.getItem(KEYS.GURU);
  if (valor) return JSON.parse(valor);
  // Guru padrão — o próprio TRITONGO
  return {
    nome: 'TRITONGO',
    tipo: 'Companheiro Editorial',
    personalidade: 'filosofo',
    avatar: 'tritongo', // usa imagem padrão do app
    fraseBoasVindas: 'Seu companheiro editorial está aqui.',
  };
}

// PAUTAS KANBAN
export async function salvarPautas(pautas) {
  await AsyncStorage.setItem(KEYS.PAUTAS, JSON.stringify(pautas));
}

export async function carregarPautas() {
  const valor = await AsyncStorage.getItem(KEYS.PAUTAS);
  if (valor) return JSON.parse(valor);
  return { backlog: [], emProducao: [], pronto: [] };
}

// CALENDÁRIO
export async function salvarCalendario(calendario) {
  await AsyncStorage.setItem(KEYS.CALENDARIO, JSON.stringify(calendario));
}

export async function carregarCalendario() {
  const valor = await AsyncStorage.getItem(KEYS.CALENDARIO);
  if (valor) return JSON.parse(valor);
  return {};
}
