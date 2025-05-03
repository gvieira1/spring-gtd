
import { loadCategorias } from './categorias.js';

export function loadTarefas() {
    $.get('/gtd-spring/tarefas', function(tarefas) {
        console.log(tarefas);
        const tarefasList = $('#tarefasList');
        tarefasList.empty();

        tarefas.forEach(function(tarefa) {
            const tarefaItem = `
                <li class="list-group-item d-flex justify-content-between align-items-center overflow-y-scroll" data-task-id="${tarefa.id}">
                    ${tarefa.descricao} 
                    <button class="btn btn-outline-dark hoverb edit-tarefa-btn " data-tarefa-id="${tarefa.id}">Classifique</button>
                </li>
            `;
            tarefasList.append(tarefaItem);
        });

        $('.edit-tarefa-btn').click(function() {
            const tarefaId = $(this).data('tarefa-id');
            openEditModal(tarefaId);
        });
    }).fail(function() {
        alert('Erro ao carregar tarefas.');
    });
}

export function createTarefa(tarefa) {
    $.ajax({
        url: '/gtd-spring/tarefas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(tarefa),
        success: function(response) {
            loadTarefas();
            $('#tarefaFormInicio')[0].reset();
            $('#AddTarefa').modal('hide');
        },
        error: function(error) {
            alert('Erro ao criar tarefa: ' + error.responseText);
        }
    });
}

export function openEditModal(tarefaId) {
    $('#tarefaForm')[0].reset();

    $.get(`/gtd-spring/atualiza/${tarefaId}`, function(tarefa) {
        $('#descricaomodal').val(tarefa.descricao);
        $('#prioridademodal').prop('checked', tarefa.prioridade);
        $('#delegadomodal').prop('checked', tarefa.delegado);
        if (tarefa.prazo) { $('#prazomodal').val(tarefa.prazo); }
        $('#tempo_estimado').val(tarefa.tempoEstimadoId);
        if (tarefa.assunto) { $('#assuntomodal').val(tarefa.assunto); }
        $('#categoriamodal').val(tarefa.categoriaId);
        $('#taskId').data('id', tarefa.id);
        $('#tarefasModal').modal('show');
    }).fail(function() {
        alert('Erro ao carregar os dados da tarefa.');
    });
}

export function openEditModalClassificado(tarefaId) {
    //
    $.get(`/gtd-spring/atualiza/${tarefaId}`, function(tarefa) {
        $('#descricaomodal').val(tarefa.descricao);
        $('#prioridademodal').prop('checked', tarefa.prioridade);
        $('#delegadomodal').prop('checked', tarefa.delegado);
        if (tarefa.prazo) { $('#prazomodal').val(tarefa.prazo); }
        $('#tempo_estimado').val(tarefa.tempoEstimadoId);
        if (tarefa.assunto) { $('#assuntomodal').val(tarefa.assunto); }
        $('#categoriamodal').val(tarefa.categoriaId);
        $('#taskId').data('id', tarefa.id);
        $('#tarefasModal').modal('show');
    }).fail(function() {
        alert('Erro ao carregar os dados da tarefa.');
    });
}

/*export function updateTarefa(tarefaId, tarefaAtualizada) {
    $.ajax({
        url: `/gtd-spring/atualiza/${tarefaId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(tarefaAtualizada),
        success: function(response) {
            console.log("Resposta do servidor:", response);
            $('#tarefasModal').modal('hide');
            $(`#tarefasList li[data-task-id="${tarefaId}"]`).remove();
            loadCategorias();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Erro:", textStatus, errorThrown, jqXHR);
            alert('Erro ao atualizar a tarefa: ' + textStatus);
        }
    });
}*/
//
//export function updateFeito(tarefaId, tarefaFeita) {
//	
//	$.ajax({
//	        url: `/gtd-spring/atualiza/${tarefaId}`,  
//	        method: 'PUT',
//	        data: JSON.stringify(tarefaFeita),
//	        contentType: 'application/json',
//	        success: function(response) {
//	            console.log('Tarefa marcada como feita:', response);
//				loadCategorias();
//	        },
//	        error: function(xhr, status, error) {
//	            console.log('Erro ao atualizar tarefa feita:', error, xhr, status);
//	        }
//	});
//}



//export function deleteTask(taskId) {
//    console.log('Deletando tarefa:', taskId);
//
//    $.ajax({
//        url: `/api/task/${taskId}`,
//        type: 'DELETE',
//        success: function(_, textStatus, xhr) {
//            if (xhr.status === 204 || xhr.status === 200) {
//                console.log('Tarefa excluída com sucesso.');
//                loadCategorias();
//            } else {
//                alert('Erro inesperado. Código de status: ' + xhr.status);
//            }
//        },
//        error: function(xhr, status, error) {
//            console.error('Erro ao excluir a tarefa:', error);
//            alert('Ocorreu um erro ao tentar excluir a tarefa.');
//        }
//    });
//}


