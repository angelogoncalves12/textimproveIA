import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Pega as senhas e chaves secretas guardadas no arquivo .env
dotenv.config();

// 2. Descobre o caminho das pastas no computador
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

// Função que cria o nosso servidor (como se fosse montar a cozinha do restaurante)
export function createApp() {
    const app = express();

    // Pega a nossa chave de api para poder conversar com a inteligência artificial (Groq)
    const API_KEY = process.env.API_KEY;

    // Ensina o servidor a ler mensagens em formato de texto/objeto (JSON)
    app.use(express.json());

    // Libera a passagem: permite que a página do site converse com o servidor sem bloqueios de segurança
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    // Quando alguém entra no site, entrega a página visual principal (index.html)
    app.get('/', (req, res) => {
        res.sendFile(path.join(frontendDir, 'index.html'), (err) => {
            if (err) {
                console.error('Erro ao enviar index.html:', err);
                res.status(500).send('Erro ao carregar a página');
            }
        });
    });

    // Entrega o visual (CSS) e os cliques (JS) muito pica para quem acessar o site
    app.use(express.static(frontendDir));

    // Uma rota de teste só para checar se o servidor está vivo
    app.get('/reescrita', (req, res) => {
        res.status(200).json({
            message: 'Use o método POST para enviar o texto.',
            apiKeyPresent: !!API_KEY
        });
    });

    // AQUI É O PRINCIPAL DE TUDO:: site envia o texto pra cá para ser reescrito
    app.post('/reescrita', async (req, res) => {
        const { texto } = req.body;

        // Se a pessoa não escreveu nada na caixinha, avisa o erro
        if (!texto) {
            return res.status(400).json({ error: 'Texto é obrigatório' });
        }

        // Se esquecemos de colocar a chave da IA, avisa
        if (!API_KEY) {
            return res.status(500).json({ error: 'API_KEY não configurada no ambiente.' });
        }

        try {
            // Mandamos uma carta (pedido) para a IA da Groq com o texto e as instruções
            const resposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b',
                    temperature: 0,
                    max_tokens: 1024,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente especializado em aprimoramento e reescrita de textos. Sua função é transformar qualquer texto fornecido (inclusive gírias, linguagem coloquial, abreviações de internet como "blz", "pq", "hj", "deu ruim" ou textos mal pontuados) em um português estritamente culto, elegante, profissional e coeso. REGRAS: 1. Interprete o sentido das gírias e abreviações e traduza para o padrão formal. 2. Nunca responda como chat ou conversa; apenas entregue o texto reformulado. 3. Mantenha o sentido e a intenção da mensagem original. 4. Responda apenas com o texto reescrito.'
                        },
                        {
                            role: 'user',
                            content: 'Reescreva o seguinte texto em tom formal e profissional:\n\n' + texto
                        },
                        {
                            role: 'assistant',
                            content: '<<<INICIO>>>O pequeno roedor desgastou a vestimenta do monarca.<<<FIM>>>'
                        },
                        {
                            role: 'user',
                            content: 'Reescreva o seguinte texto e RETORNE APENAS o texto reescrito entre as marcas <<<INICIO>>> e <<<FIM>>>. NÃO inclua explicações, cabeçalhos, ou texto adicional fora das marcas. Se não for possível, retorne somente o texto reescrito:\n\n' + texto
                        }
                    ]
                })
            });

            // Lemos a resposta que a IA nos devolveu
            const textoResposta = await resposta.text();
            let dados;
            try {
                dados = JSON.parse(textoResposta);
            } catch (e) {
                dados = { raw: textoResposta };
            }

            // Se a IA reclamou de algo (ex: chave errada), devolvemos o erro
            if (!resposta.ok) {
                console.error('API da Groq retornou erro:', resposta.status, textoResposta);
                return res.status(502).json({ error: 'Erro na API Groq', detalhes: dados });
            }

            // Pegamos apenas a mensagem de texto que a IA escreveu
            const msg = dados.choices?.[0]?.message;
            let conteudo = msg?.content || msg?.reasoning_content || '';

            if (conteudo) {
                // Removemos as marcações <<<INICIO>>> e <<<FIM>>> para deixar só o texto bonito
                const match = conteudo.match(/<<<INICIO>>>([\s\S]*?)<<<FIM>>>/);
                let resultadoFinal = match ? match[1].trim() : conteudo.trim();

                resultadoFinal = resultadoFinal
                    .replace(/<<<INICIO>>>/g, '')
                    .replace(/<<<FIM>>>/g, '')
                    .trim();

                // Entregamos o texto pronto de volta para a tela do usuário!
                return res.json({ resultado: resultadoFinal });
            } else {
                console.error('Resposta vazia da Groq:', dados);
                return res.status(500).json({ error: 'Resposta vazia da IA', dados });
            }
        } catch (error) {
            console.error('Erro interno:', error);
            res.status(500).json({ error: 'Erro interno no servidor', mensagem: error.message });
        }
    });

    return app;
}

// Essa função só serve para rodar o servidor no seu computador localmente
export function startServer(port = process.env.PORT || 3000) {
    const app = createApp();
    const server = app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
    return server;
}

// Cria a aplicação
const app = createApp();

// Se você rodou o arquivo pelo terminal com "node back/node.js", ele liga o servidor
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}

// Entrega essa delicia pronto para a Vercel ligar na nuvem sempre que alguém usar
export default app;

