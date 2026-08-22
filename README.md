<div align="center">

  <!-- Logo do Projeto -->
  <img src="assets/logomax.png" alt="Maximum AI Logo" width="100"/>
  <img src="assets/maxxiatext.png" alt="Maximum AI Texto" width="220"/>

  <h1>MAXIMUM AI — Agente de Aprimoramento Textual</h1>
  <p><strong>Site minimalista integrado a um Agente de IA (OpenAi) para formatação de texto empresarial.</strong></p>

  <!-- Badges -->
  <p>
  <img src="https://img.shields.io/badge/Status-Em%20Andamento-yellow?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/AI_Model-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI"/>
  <img src="https://img.shields.io/badge/Node.js-Backend%20Security-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/HTML5%20%2F%20CSS3-Frontend-orange?style=for-the-badge" alt="Frontend"/>
</p>

</div>

<br/>

## 📌 Sobre o Projeto

O **Maximum AI** é uma aplicação web minimalista focada no aprimoramento e formatação de textos corporativos. Utilizando as próprias palavras do usuário, o agente de IA baseado no modelo **OpenAI 20b** produz uma versão formal, polida e profissional sem alterar o sentido original do texto.

---

## 🔒 Segurança em Primeiro Lugar (A Jornada do Projeto)

Este projeto nasceu durante meus estudos de consumo de Inteligência Artificial gratuita pelo **DevClub**. Contudo, ao analisar a estrutura padrão apresentada nas aulas, identifiquei um problema crítico de segurança: **a API Key ficava exposta diretamente no código Front-end**, vulnerável a vazamentos no GitHub.

Mesmo sendo um projeto originalmente focado em Front-end, decidi dar um passo além:
- 🛡️ **Node.js & Backend Seguro:** Fui em busca de fundamentos de Node.js para criar um servidor intermediário responsável por realizar as requisições à IA, protegendo a chave de API.
- 📁 **Proteção com `.gitignore` & Variáveis de Ambiente:** Implementei o isolamento de credenciais locais para garantir commits 100% seguros no GitHub.
- 🧠 **Aprendizado Consciente:** Foram meses de testes práticos, leitura de documentações, tutoriais e apoio suplementar de ferramentas como *Claude AI, Gemini e Copilot*.

> ⚠️ **Nota de Filosofia Técnica:** Este projeto **não compactua inteiramente com "Vibe Coding"**. Todas as IAs foram utilizadas como suporte de aprendizado e depuração, priorizando o entendimento real da arquitetura e da segurança por trás de cada linha de código.

---

## ✨ Funcionalidades

- 🖋️ **Formatação Formal Direta:** Converte rascunhos em textos formais prontos para o ambiente de trabalho.
- ⚡ **Otimização Corporativa:** Agente guiado para evitar alucinações e abstrações desnecessárias.
- 🔒 **Arquitetura Segura:** Chave de API blindada no servidor local.
- 🎨 **Interface Dark Minimalista:** Experiência de uso limpa e focada em produtividade.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5 semântico, CSS3 Moderno (Flexbox & Dark Theme), JavaScript Vanilla.
- **Backend / Segurança:** Node.js, Express (ou servidor HTTP para requisições seguras), `.env` e `.gitignore`.
- **Inteligência Artificial:** Modelo OpenAI.

---

## 🚀 Como Executar o Projeto (VIA VERCEL)
> APENAS ACESSE: (https://maximumai.vercel.app)


## 🚀 Como Executar o Projeto (VIA REPOSITÓRIO)

> [!IMPORTANT]
> Para o site funcionar e se comunicar com a IA de forma segura, **o servidor Node.js deve ser iniciado via terminal**.

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) instalado no seu computador.
- Git instalado.

### 2. Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/maximum-ai.git
   cd maximum-ai
   ```

2. **Instale as dependências (se houver `package.json`):**
   ```bash
   npm install
   ```

3. **Configure sua Chave de API:**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave:
   ```env
   API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor Node.js no terminal:**
   ```bash
   node scripts.js
   # ou npm start / node server.js (conforme o nome do seu arquivo backend)
   ```

5. **Abra o Frontend:**
   - Execute o `index.html` via **Live Server** no VS Code ou abra-o diretamente no navegador.

---

## 📁 Estrutura de Pastas

```bash
📂 maximum-ai/
 ├── 📂 assets/
 │    ├── logomax.png       # Ícone do projeto
 │    └── maxxiatext.png    # Tipografia da logo
 ├── .env.example           # Exemplo de variáveis de ambiente
 ├── .gitignore             # Arquivos ignorados (node_modules, .env, chaves)
 ├── index.html             # Interface principal
 ├── about.html             # Página 'Sobre'
 ├── styles.css             # Estilização visual
 ├── scripts.js            # Lógica e integração segura
 └── README.md              # Documentação oficial
```

---

## 👨‍💻 Autor & Contato

Desenvolvido com dedicação por **ClangsDev**.

- 📸 **Instagram:** [@correiasvz](https://instagram.com/correiasvz)
- 🐙 **GitHub:** [@angelogoncalves12](https://github.com/angelogoncalves12)
- 💰 **Doações** [@clangs](https://livepix.gg/clangs)

---

<div align="center">
  <sub>Maximum AI — Segurança, minimalismo e comunicação profissional.</sub>
</div>
```
