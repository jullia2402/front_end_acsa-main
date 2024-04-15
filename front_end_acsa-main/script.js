const localStorage = window.localStorage;
let tarefaArrayLista = localStorage.getItem('tasksList') ? JSON.parse(localStorage.getItem('tasksList')) : [];
localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista));

class TarefaObj {
    constructor(id, descricao, status) {
        this.id = id;
        this.descricao = descricao;
        this.status = status;
    }
}

window.onload = function () {
    listarTarefa();
};

function listarTarefa() {

    const parent = document.getElementById("table");
    while (parent.firstChild) {
        parent.firstChild.remove()
    }

    // Cria o cabeçalho da tabela
    criaCabecalhoTable();

    const dadosLocalStorage = JSON.parse(localStorage.getItem('tasksList'));
    tarefaArrayLista = [];
    let index = 0;
    dadosLocalStorage.forEach(item => {
        item.id = index;
        tarefaArrayLista.push(item);
        criarElemento(item);
        index++;
    });


    var linhasTabela = document.getElementsByTagName("tr");

    for (var i = 0; i < linhasTabela.length; i++) {
        if (i == 0) {
            continue;
        }
        else if ((i) % 2 == 0) {
            linhasTabela[i].className = "styleOne";
        }
        else {
            linhasTabela[i].className = "styleTwo";
        }
    }

    localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista))
}

function criaCabecalhoTable() {
    var row = document.createElement("tr");
    row.style = 'background-color: #6c757d ';
    var thTask = document.createElement("th");
    thTask.innerHTML = 'Tarefa';
    thTask.style = 'width: 600px; text-align: left; border-radius:15px; color: white';
    row.append(thTask);

    var thActions = document.createElement("th");
    thActions.innerHTML = 'Opcões';
    thActions.style = 'text-align: center; border-radius:20px';
    thActions.colSpan = 3;
    row.append(thActions);

    const table = document.getElementById("table");
    table.insertBefore(row, table.childNodes[0]);// Adiciona a linha na posição zero(0) tabela
}

function criarElemento(objetoTarefa) {
    const taskId = `tarefa_id_${objetoTarefa.id}`;

    // Create two new cells
    var cellTextoTarefa = document.createElement("td");
    cellTextoTarefa.id = taskId;
    cellTextoTarefa.innerHTML = objetoTarefa.descricao;

    var cellCheckBox = document.createElement("td");
    var cellEditar = document.createElement("td");
    var cellDeletar = document.createElement("td");
    const rowId = `row_id_${objetoTarefa.id}`;

    cellCheckBox.appendChild(criaInputCheckBoxTarefa(taskId));
    cellEditar.appendChild(criaButtonGeneric('Editar', 'btn_editar', `modalEdicaoTarefa('${taskId}')`));
    cellDeletar.appendChild(criaButtonGeneric('Deletar', 'btn_deletar', `deletarTarefa('${rowId}', '${taskId}')`));

    var row = document.createElement("tr");
    row.id = rowId;
    row.appendChild(cellTextoTarefa);
    row.appendChild(cellCheckBox);
    row.appendChild(cellEditar);
    row.appendChild(cellDeletar);
    const table = document.getElementById("table");
    table.appendChild(row);// Adiciona a linha na tabela
    const inputNovaTarefa = document.getElementById('input_nova_tarefa');
    inputNovaTarefa.value = ''; // Limpa o input de tarefa
    document.getElementById("input_nova_tarefa").focus(); // Seta o foco no input

    const idInputChecked = `checkbox_${taskId}`;

    if (!objetoTarefa.status) {
        row.style = 'text-decoration: none;';
        document.getElementById(idInputChecked).checked = false;
    } else {
        row.style = 'text-decoration: line-through;';
        document.getElementById(idInputChecked).checked = true;
    }
}

function criaInputCheckBoxTarefa(taskId) {
    const inputTarefa = document.createElement('input');
    inputTarefa.id = `checkbox_${taskId}`;
    inputTarefa.type = 'checkbox';
    inputTarefa.setAttribute('onclick', `mudaEstadoTarefa('${taskId}')`);
    return inputTarefa;
}

function criaButtonGeneric(nome, className, funcao) {
    var button = document.createElement('input');
    button.id = `button${nome}`;//"buttonEditar";
    button.type = "button";
    button.value = nome;
    button.className = `btn_generic ${className}`;
    button.setAttribute('onclick', funcao);
    return button;
}

function addTask() {
    const novaTarefa = document.getElementById('input_nova_tarefa').value;
    if (novaTarefa == null || novaTarefa == '') {
        swal('OPS!, Enter the task description.', {
            button: {
                text: "OK",
            },
        });
        return;
    }
    const table = document.getElementById("table");
    let quantidade = table.children.length;
    let objTarefa = new TarefaObj();
    objTarefa.id = quantidade;
    objTarefa.descricao = novaTarefa;
    objTarefa.status = false;
    criaNovaTarefa(objTarefa, true);
};

function criaNovaTarefa(objeto) {
    let temItem = false;

    for (var i = 0; i < tarefaArrayLista.length; i++) {
        if (tarefaArrayLista[i].descricao.trim() == objeto.descricao.trim()) {
            temItem = true;
            break;
        }
    }

    if (temItem) {
        swal('Alert!', 'This task has already been registered.', "info");
        return;
    }

    let objetoTarefa = new TarefaObj();
    objetoTarefa.id = objeto.id - 1;
    objetoTarefa.descricao = objeto.descricao;
    objetoTarefa.status = false;
    tarefaArrayLista.push(objetoTarefa);
    criarElemento(objetoTarefa);

    var linhasTabela = document.getElementsByTagName("tr");
    for (var i = 0; i < linhasTabela.length; i++) {
        if (i == 0) continue;// Não pinta o cabeçalho da tabela
        if ((i) % 2 == 0) {
            linhasTabela[i].className = "styleOne";
        }
        else {
            linhasTabela[i].className = "styleTwo";
        }
    }

    localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista))
}

function mudaEstadoTarefa(taskId) {
    const tarefa = document.getElementById(taskId).innerHTML;
    let indexItem = -1;
    let objTarefa = new TarefaObj();
    objTarefa.id = indexItem;
    objTarefa.descricao = tarefa;

    for (var i = 0; i < tarefaArrayLista.length; i++) {
        if (tarefaArrayLista[i].descricao.trim() == tarefa.trim()) {
            objTarefa.status = !tarefaArrayLista[i].status;
            indexItem = i;
            break;
        } else {
            objTarefa.status = tarefaArrayLista[i].status;
        }
    }
    tarefaArrayLista.splice(indexItem, 1);
    tarefaArrayLista.push(objTarefa);
    localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista));
    listarTarefa();
}

function modalEdicaoTarefa(taskId) {
    const taskSelected = document.getElementById(taskId).innerHTML;
    //let tarefaAlterada = prompt('Changing task', taskSelected);
    // Documentação do exemplo: https://sweetalert.js.org/guides/ AND https://sweetalert2.github.io/#examples

    for (var i = 0; i < tarefaArrayLista.length; i++) {
        if (tarefaArrayLista[i].descricao.trim() == taskSelected.trim() && tarefaArrayLista[i].status) {
            swal('Attention!', 'This task has now been completed.', "warning");
            return;
        }
    }

    swal({
        title: 'Changing task!',
        content: "input",
        content: {
            element: "input",
            attributes: {
                placeholder: "Please inform the task",
                value: taskSelected,
            },
        },
        closeModal: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        height: 250,
    }).then((newValue) => {
        if (newValue) {
            update(newValue, taskId)
        } else {
            swal('Attention!', 'This task has not changed.', "info");
        }
    });
}

function update(newValue, taskId) {
    document.getElementById(taskId).innerHTML = newValue;
    let indexItem = taskId.replace('tarefa_id_', '');
    let status = false;
    if (newValue != null) {
        for (var i = 0; i < tarefaArrayLista.length; i++) {
            if (tarefaArrayLista[i].descricao.trim() == newValue.trim()) {
                status = tarefaArrayLista[i].status;
                temItem = true;
                break;
            }
        }
        let objTarefa = new TarefaObj();
        objTarefa.id = indexItem;
        objTarefa.descricao = newValue;
        objTarefa.status = status;
        tarefaArrayLista.splice(indexItem, 1);
        tarefaArrayLista.push(objTarefa);
        localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista));
    }
}

function deletarTarefa(rowId, idTask) {
    var row = document.getElementById(rowId);
    const id = rowId.replace("row_id_", '');
    var rowDescri = document.getElementById(idTask).innerHTML;
    swal({
        title: `Do you really want to delete this task: "${rowDescri}"?`,
        icon: "info",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,

    }).then((willDelete) => {
        if (willDelete) {
            row.parentNode.removeChild(row);
            tarefaArrayLista.splice(id, 1);
            localStorage.setItem('tasksList', JSON.stringify(tarefaArrayLista));
            listarTarefa();
            swal("Task deleted successfully!", {
                icon: "warning",
                timer: 2000,
            });
        }
    });
}