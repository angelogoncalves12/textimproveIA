import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = 3000;
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

app.post('/reescrita', async (req, res) => {
    const { texto } = req.body;
    if (!texto) {
        return res.status(400).json({ error: 'Texto é obrigatório' });
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//ajuste IA