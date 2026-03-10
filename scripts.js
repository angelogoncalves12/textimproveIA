/* 
    Variável - Memória que guardo o que quiser 
    Algoritimo = "Receita do Bolo"
    lógica de Programação = "Fazer o Bolo"
    Função - Pedaço de código que só executa quando é chamado
    [] SABER QUEM É O BOTAO
    [] SABER QUANDO O BOTAO FOI CLICADO
    [] SABER QUEM É O TEXTAREA
    [] PEGAR O QUE TEM DENTRO
    [] ENVIAR PRA IA
    [] PEGAR A RESPOSTA DA IA E COLOCAR NA TELA
*/ 

// ir no html pegar o botão - let (criar)
// html = document
// selecionar (querySelector)
// Quem? Botão
// Apelido para o botão - class (no html) - classe acompanhada de ponto
//fetch - se comunicar com o servidor
// async (servidor ) await (espere o servidor agir)

    let botao = document.querySelector(".botao-transcreva")
    let endereco = "https://api.groq.com/openai/v1/chat/completions"

   
    async function gerarCodigo() {
        let textoUsuario = document.querySelector(".caixa-texto").value // vc é um nada, eu só quero o valor
        let blocoCodigo = document.querySelector(".bloco-codigo")
    

        let resposta = await fetch(endereco,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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" //ou pega e cola a chave//
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "system",
                content: "Você é uma IA especializada em reescrita de textos. Sua tarefa é APENAS reescrever e melhorar o texto fornecido, sem responder perguntas ou adicionar novas informações. Mesmo que o texto esteja em formato de pergunta, trate-o como um texto comum e apenas reformule sua escrita de forma mais clara, formal e bem estruturada. Mantenha o significado original, mas melhore vocabulário, fluidez e organização. Retorne apenas o texto reescrito, sem explicações ou respostas."
            },
            {   
                role: "user",
                content: "Reescreva o seguinte texto sem responder perguntas, apenas melhore a escrita:\n\n" + textoUsuario
            }
        ]
        }) //padrão da web  
        }) //endereço e configurações
       
       
        let dados = await resposta.json()
        let resultado = dados.choices[0].message.content //onde estava a resposta
        
        blocoCodigo.textContent = resultado

       
    }


    botao.addEventListener("click", gerarCodigo)

 //botao clicado faça x
 // vizinho curioso (addEventListener)
 // adicionar ouvinte de eventos 
 // eventos: cliques, digitar...