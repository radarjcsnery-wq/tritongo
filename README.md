# TRITONGO 📅🕯️📱
**Plataforma Editorial Inteligente para Microblogs**

> Ateliê · Mural de Pauta · Studio

---

## 📱 O que é o TRITONGO?

App Android para escritores de microblog que querem:
- Receber notícias filtradas por IA
- Planejar postagens com calendário e Kanban
- Gerar textos no seu tom editorial
- Tudo com seu Guru personalizado ao lado

---

## 🚀 Como gerar o APK (pelo celular)

### Passo 1 — Criar conta no Expo
1. Acesse **expo.dev** no Chrome modo desktop
2. Crie uma conta gratuita
3. Anote seu **username**

### Passo 2 — Criar repositório no GitHub
1. Acesse **github.com** no Chrome modo desktop
2. Clique em **New repository**
3. Nome: `tritongo`
4. Clique em **Create repository**
5. Faça upload de todos os arquivos desta pasta

### Passo 3 — Conectar Expo ao GitHub
1. No **expo.dev**, vá em **Projects → New Project**
2. Conecte ao repositório `tritongo` do GitHub
3. Clique em **Build → Android**
4. Aguarde a compilação (15-20 minutos)
5. Baixe o APK gerado

### Passo 4 — Instalar no celular
1. Abra o APK baixado no Android
2. Permita instalação de fontes desconhecidas
3. Instale e abra o TRITONGO
4. Digite o código de acesso: **TRITONGO2026**

---

## 🔑 Alterar código de acesso

Para mudar a senha de um novo lote:
1. Abra o arquivo `src/services/storage.js`
2. Encontre a linha: `export const SENHA_LOTE = 'TRITONGO2026';`
3. Troque pela nova senha
4. Gere um novo APK

---

## 📂 Estrutura do projeto

```
tritongo/
├── App.js                    ← Entrada do app
├── app.json                  ← Configuração Expo
├── package.json              ← Dependências
├── src/
│   ├── theme.js              ← Cores e tipografia
│   ├── screens/
│   │   ├── SplashScreen.js   ← Splash + código de acesso
│   │   ├── AtelieScreen.js   ← Guru + feed de notícias
│   │   ├── MuralPautaScreen.js ← Calendário + Kanban
│   │   ├── StudioScreen.js   ← Busca IA + geração de texto
│   │   └── ConfiguracoesScreen.js ← Personalizar Guru
│   ├── navigation/
│   │   └── Navigation.js     ← Navegação entre telas
│   └── services/
│       ├── rss.js            ← Busca de notícias (RSS gratuito)
│       └── storage.js        ← Armazenamento local
```

---

## 🎨 Identidade visual

| Ambiente | Cor | Função |
|----------|-----|--------|
| Ateliê | Verde | Guru e acolhimento |
| Mural de Pauta | Laranja | Planejamento |
| Studio | Azul | Tecnologia e IA |

Paleta principal: vermelho `#c0392b` + dourado `#d4a017` + fundo escuro `#1a0f0a`

---

## 📰 Fontes de notícias (RSS gratuito, sem limite)

- G1 (Globo)
- UOL Notícias
- BBC Brasil
- Folha de S.Paulo

---

**TRITONGO v1.0.0** · Seu companheiro editorial está aqui.
