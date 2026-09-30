let tarefas = [];


const formTarefa = document.getElementById("formTarefa");
const tituloTarefa = document.getElementById("tituloTarefa");
const listaTarefas = document.getElementById("listaTarefas");
const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");
const filtro = document.getElementById("filtro");
const totalTarefas = document.getElementById("totalTarefas");
const percentualConclusao = document.getElementById("percentualComclusão");


function carregarTarefas() {
    const dados = localStorage.getItem("tarefas");
    tarefas = dados ? JSON.parse(dados) : [];
    renderizarTarefas();
}

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;

    setTimeout(() => {
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }, 3000);
}


function adicionarTarefa() {
    const titulo = tituloTarefa.value.trim();

    if (titulo === "") {
        mostrarMensagem("Digite um título para a tarefa.", "erro");
        tituloTarefa.focus();
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        titulo: titulo,
        concluida: false
    };

    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();

    tituloTarefa.value = "";
    tituloTarefa.focus();
    mostrarMensagem("Tarefa adicionada com sucesso!", "sucesso");
}


function alternarStatusTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        renderizarTarefas();
    }
}


function excluirTarefa(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas();
    renderizarTarefas();
    mostrarMensagem("Tarefa excluída com sucesso!", "sucesso");
}


function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    const textoPesquisa = pesquisa.value.toLowerCase().trim();
    const tipoFiltro = filtro.value;

    const tarefasFiltradas = tarefas.filter(tarefa => {
        const correspondePesquisa = tarefa.titulo.toLowerCase().includes(textoPesquisa);
        let correspondeFiltro = true;

        if (tipoFiltro === "pendentes") correspondeFiltro = !tarefa.concluida;
        if (tipoFiltro === "concluidas") correspondeFiltro = tarefa.concluida;

        return correspondePesquisa && correspondeFiltro;
    });

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `<div style="text-align:center; color: var(--text-secondary); padding: 15px;">Nenhuma tarefa encontrada.</div>`;
    } else {
        tarefasFiltradas.forEach(tarefa => {
            const item = document.createElement("div");
            item.classList.add("item-tarefa");
            if (tarefa.concluida) item.classList.add("concluida");

            item.innerHTML = `
                <span>${tarefa.titulo}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-status" style="background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                        ${tarefa.concluida ? "Reabrir" : "Concluir"}
                    </button>
                    <button class="btn-excluir" style="background: transparent; border: 1px solid var(--neon-pink); color: var(--neon-pink); padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                        Excluir
                    </button>
                </div>
            `;

            item.querySelector(".btn-status").addEventListener("click", () => alternarStatusTarefa(tarefa.id));
            item.querySelector(".btn-excluir").addEventListener("click", () => excluirTarefa(tarefa.id));

            listaTarefas.appendChild(item);
        });
    }

    atualizarContadores();
}
 
function atualizarContadores() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const percentual = total > 0 ? (concluidas / total) * 100 : 0;

    if (totalTarefas) totalTarefas.textContent = total;
    if (percentualComclusao) percentualComclusao.textContent = `${percentual.toFixed(0)}%`;
}

formTarefa.addEventListener("submit", (e) => {
    e.preventDefault();
    adicionarTarefa();
});

pesquisa.addEventListener("input", renderizarTarefas);
filtro.addEventListener("change", renderizarTarefas);

carregarTarefas();