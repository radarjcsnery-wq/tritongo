// TRITONGO - Serviço de RSS
// Busca notícias reais dos maiores portais brasileiros sem API key, sem limite

const RSS_FEEDS = {
  geral: [
    { nome: 'G1', url: 'https://g1.globo.com/rss/g1/' },
    { nome: 'UOL', url: 'https://rss.uol.com.br/feed/noticias.xml' },
    { nome: 'BBC Brasil', url: 'https://feeds.bbci.co.uk/portuguese/rss.xml' },
    { nome: 'Folha', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml' },
  ],
  politica: [
    { nome: 'G1 Política', url: 'https://g1.globo.com/rss/g1/politica/' },
    { nome: 'BBC Política', url: 'https://feeds.bbci.co.uk/portuguese/brasil/rss.xml' },
  ],
  tecnologia: [
    { nome: 'G1 Tecnologia', url: 'https://g1.globo.com/rss/g1/tecnologia/' },
    { nome: 'UOL Tech', url: 'https://rss.uol.com.br/feed/tecnologia.xml' },
  ],
  economia: [
    { nome: 'G1 Economia', url: 'https://g1.globo.com/rss/g1/economia/' },
    { nome: 'Folha Mercado', url: 'https://feeds.folha.uol.com.br/mercado/rss091.xml' },
  ],
  cultura: [
    { nome: 'G1 Cultura', url: 'https://g1.globo.com/rss/g1/pop-arte/' },
  ],
};

// Proxy público para contornar CORS em React Native Web (não necessário no APK nativo)
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

function parseRSS(xmlText) {
  try {
    // Parser simples de RSS sem dependência externa
    const items = [];
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

    itemMatches.slice(0, 10).forEach(item => {
      const getTag = (tag) => {
        const match = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
        return match ? (match[1] || match[2] || '').trim() : '';
      };

      const getImage = () => {
        const mediaMatch = item.match(/url="([^"]*\.(jpg|jpeg|png|gif|webp)[^"]*)"/i);
        const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/);
        const imgMatch = item.match(/<img[^>]*src="([^"]+)"/i);
        return mediaMatch?.[1] || enclosureMatch?.[1] || imgMatch?.[1] || null;
      };

      const titulo = getTag('title');
      const descricao = getTag('description').replace(/<[^>]+>/g, '').trim();
      const link = getTag('link') || getTag('guid');
      const pubDate = getTag('pubDate');
      const imagem = getImage();

      if (titulo && titulo.length > 5) {
        items.push({
          id: Math.random().toString(36).substr(2, 9),
          titulo,
          descricao: descricao.substring(0, 200),
          link,
          imagem,
          data: pubDate ? new Date(pubDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '',
          dataObj: pubDate ? new Date(pubDate) : new Date(),
        });
      }
    });

    return items;
  } catch (e) {
    console.log('Erro ao parsear RSS:', e);
    return [];
  }
}

export async function buscarNoticias(categoria = 'geral', limite = 20) {
  const feeds = RSS_FEEDS[categoria] || RSS_FEEDS.geral;
  const todasNoticias = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feed.url)}`, {
        timeout: 8000,
      });
      const json = await response.json();
      const noticias = parseRSS(json.contents || '');
      noticias.forEach(n => { n.fonte = feed.nome; });
      todasNoticias.push(...noticias);
    } catch (e) {
      console.log(`Erro ao buscar ${feed.nome}:`, e.message);
    }
  }

  // Ordena por data mais recente
  todasNoticias.sort((a, b) => b.dataObj - a.dataObj);

  return todasNoticias.slice(0, limite);
}

export const CATEGORIAS = [
  { id: 'geral', label: 'Geral', icon: '📰' },
  { id: 'politica', label: 'Política', icon: '🏛️' },
  { id: 'tecnologia', label: 'Tecnologia', icon: '💻' },
  { id: 'economia', label: 'Economia', icon: '📈' },
  { id: 'cultura', label: 'Cultura', icon: '🎭' },
];
