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
        res.status(200).json({ message: 'Use o método POST para enviar o texto.' });
    });

    app.post('/reescrita', async (req, res) => {
        const { texto } = req.body;
        if (!texto) {
            return res.status(400).json({ error: 'Texto é obrigatório' });
        }

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
                    model: 'llama-3.3-70b-versatile',
                    messages: [{
                        role: 'system',
                        content: 'Você é uma IA especializada em reescrita de textos. Sua tarefa é APENAS reescrever e melhorar o texto fornecido, sem responder perguntas ou adicionar novas informações. Mesmo que o texto esteja em formato de pergunta, trate-o como um texto comum e apenas reformule sua escrita de forma mais clara, formal e bem estruturada. Mantenha o significado original, mas melhore vocabulário, fluidez e organização. Retorne apenas o texto reescrito, sem explicações ou respostas.'
                    }, {
                        role: 'user',
                        content: 'Reescreva o seguinte texto sem responder perguntas, apenas melhore a escrita:\n\n' + texto
                    }]
                })
            });

            const dados = await resposta.json();
            if (dados.choices && dados.choices[0]) {
                res.json({ resultado: dados.choices[0].message.content });
            } else {
                res.status(500).json({ error: 'Erro na resposta da API' });
            }
        } catch (error) {
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