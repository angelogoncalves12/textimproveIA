import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

export function createApp() {
    const app = express();
    const API_KEY = process.env.API_KEY;
    

    console.log('API_KEY presente no processo?', !!API_KEY);
    app.use(express.json());

    // Middleware para CORS
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

    app.get('/', (req, res) => {
        res.sendFile(path.join(frontendDir, 'index.html'), (err) => {
            if (err) {
                console.error('Erro ao enviar index.html:', err);
                res.status(500).send('Erro ao carregar a página');
            }
        });
    });

    app.use(express.static(frontendDir));

    app.get('/reescrita', (req, res) => {
        res.status(200).json({ message: 'Use o método POST para enviar o texto.', apiKeyPresent: !!API_KEY, envVar: process.env.API_KEY ? 'set' : 'unset' });
    });

    app.post('/reescrita', async (req, res) => {
        const { texto } = req.body;
        if (!texto) {
            return res.status(400).json({ error: 'Texto é obrigatório' });
        }

        console.log('Durante requisição: apiKeyPresent=', !!API_KEY);
        if (!API_KEY) {
            return res.status(500).json({ error: 'API_KEY não configurada.' });
        }

        try {
            const resposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b',
                    temperature: 0,
                    max_tokens: 256,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é uma IA especializada em reescrita de textos. Sua tarefa é APENAS reescrever e melhorar o texto fornecido, sem responder perguntas ou adicionar novas informações. Mesmo que o texto esteja em formato de pergunta, trate-o como um texto comum e apenas reformule sua escrita de forma mais clara, formal e bem estruturada. Mantenha o significado original, mas melhore vocabulário, fluidez e organização. RETORNE SOMENTE o texto reescrito entre <<<INICIO>>> e <<<FIM>>> e NADA mais.'
                        },
                        // exemplo few-shot: entrada e saída esperada
                        {
                            role: 'user',
                            content: 'Texto de exemplo: "O rato roeu a roupa do rei."'
                        },
                        {
                            role: 'assistant',
                            content: '<<<INICIO>>>O pequeno roedor desgastou a vestimenta do monarca.<<<FIM>>>'
                        },
                        {
                            role: 'user',
                            content: 'Reescreva o seguinte texto e RETORNE APENAS o texto reescrito entre as marcas <<<INICIO>>> e <<<FIM>>>. NÂO inclua explicações, cabeçalhos, ou texto adicional fora das marcas. Se não for possível, retorne somente o texto reescrito:\n\n' + texto
                        }
                    ]
                })
            });

            const textoResposta = await resposta.text();
            let dados;
            try {
                dados = JSON.parse(textoResposta);
            } catch (e) {
                dados = { raw: textoResposta };
            }

            if (!resposta.ok) {
                console.error('API externa retornou erro:', resposta.status, textoResposta);
                return res.status(502).json({ error: 'Erro na API externa', status: resposta.status, body: textoResposta });
            }

            if (dados.choices && dados.choices[0]) {
                let conteudo = dados.choices[0].message && dados.choices[0].message.content ? dados.choices[0].message.content : '';
                // Extrair texto entre marcadores <<<INICIO>>> e <<<FIM>>>
                const marcador = /<<<INICIO>>>([\s\S]*?)<<<FIM>>>/m;
                const m = conteudo.match(marcador);
                let resultadoFinal;
                if (m && m[1]) {
                    resultadoFinal = m[1].trim();
                } else {
                    // fallback: remover prefixos comuns e retornar o texto todo
                    resultadoFinal = conteudo.replace(/^Resposta[:\-\s\n]+/i, '').trim();
                }

                
                return res.json({ resultado: resultadoFinal });
            } else {
                console.error('Resposta inesperada da API:', dados);
                res.status(500).json({ error: 'Erro na resposta da API' });
            }
        } catch (error) {
            console.error('Erro interno ao processar /reescrita:', error);
            
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });

    return app;
}

export function startServer(port = process.env.PORT || 3000) {
    const app = createApp();
    const server = app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
    return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}
//ajuste IA