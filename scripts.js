// Pega o botão e o quadrinho cinza da tela onde o texto vai aparecer
let botao = document.querySelector(".botao-transcreva");
let blocoCodigo = document.querySelector(".bloco-codigo");

// Função chamada quando a pessoa clica no botão "Reescrever"
async function gerarCodigo() {
    // 1. Pega o que o usuário escreveu na caixinha de texto
    let textoUsuario = document.querySelector(".caixa-texto").value.trim();
    
    // Se a caixinha tiver vazia, avisa e não faz nada
    if (!textoUsuario) {
        blocoCodigo.textContent = "Por favor, insira um texto para reescrever.";
        return;
    }

    // Mostra um aviso na tela para a pessoa saber que está carregando
    blocoCodigo.textContent = "Reescrevendo texto com IA, aguarde...";

    try {
        //  Manda o texto para o nosso servidor na rota /reescrita
        let resposta = await fetch('/reescrita', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: textoUsuario
            })
        });

        //  Converte o que o servidor respondeu em dados que o JS entende
        let dados = await resposta.json();

        // Se deu tudo joia e veio o resultado, coloca o texto bonito na tela
        if (dados.resultado) {
            blocoCodigo.textContent = dados.resultado;
        } else {
            // Se o servidor avisou de algum erro, mostra o erro na tela
            blocoCodigo.textContent = "Erro: " + (dados.error || JSON.stringify(dados));
        }
    } catch (error) {
        // Se a internet caiu ou deu erro grave de conexão
        blocoCodigo.textContent = "Erro ao conectar com o servidor: " + error.message;
    }
}

// Fica "escutando": quando o usuário clica no botão, executa a função gerarCodigo
botao.addEventListener("click", gerarCodigo);
 // adicionar ouvinte de eventos 
 // eventos: cliques, digitar...
 // ajuste básico
