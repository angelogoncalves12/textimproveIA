let botao = document.querySelector(".botao-transcreva");
let blocoCodigo = document.querySelector(".bloco-codigo");

async function gerarCodigo() {
    let textoUsuario = document.querySelector(".caixa-texto").value.trim();
    if (!textoUsuario) {
        blocoCodigo.textContent = "Por favor, insira um texto para reescrever.";
        return;
    }

    try {
        let resposta = await fetch('/reescrita', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: textoUsuario
            })
        });

        if (!resposta.ok) {
            throw new Error(`Servidor respondeu com status ${resposta.status}`);
        }

        let dados = await resposta.json();
        if (dados.resultado) {
            blocoCodigo.textContent = dados.resultado;
        } else {
            blocoCodigo.textContent = "Erro: " + (dados.error || "Resposta inválida");
        }
    } catch (error) {
        blocoCodigo.textContent = "Erro ao conectar com o servidor: " + error.message;
    }
}

botao.addEventListener("click", gerarCodigo);
 // adicionar ouvinte de eventos 
 // eventos: cliques, digitar...
 // ajuste básico