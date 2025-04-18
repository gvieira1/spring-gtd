

import { createTarefa, updateTarefa, updateFeito, deleteTarefa } from './api/tarefas.js';

$('#tarefaFormInicio').submit(function(event) {
    event.preventDefault();

    var tarefa = {
        descricao: $('#descricaoadd').val(),
    };

    createTarefa(tarefa);
});

$('#tarefaForm').submit(function(e) {
    e.preventDefault();

    const tarefaId = $('#taskId').data('id');
    const tarefaAtualizada = {
        id: tarefaId,
        descricao: $('#descricaomodal').val(),
        prioridade: $('#formSwitch1').prop('checked'),
        prazo: $('#prazomodal').val(),
        tempoEstimadoId: $('#tempo_estimado').val(),
        assunto: $('#assuntomodal').val(),
        delegado: $('#formSwitch2').prop('checked'),
        categoriaId: $('#categoriamodal').val()
    };

    updateTarefa(tarefaId, tarefaAtualizada);
});

$('#feitoModalForm').submit(function(e) {
    e.preventDefault();  

	const tarefaId = $('#feitoModal').data('tarefa-id');  
	const isChecked = $('#feitoModal').data('is-checked'); 
	const Descricao = $('#feitoModal').data('tarefa-desc');

	const tarefaFeita = {
	   id: tarefaId,
	   feito: isChecked,
	   descricao: Descricao
   	};
   	console.log();
	updateFeito(tarefaId, tarefaFeita);
    $('#feitoModal').modal('hide');  
});

$('#deleteTask').click(function() {
	        const tarefaIdDelete = $('#taskId').data('id')
			const descricaoDelete = $('#descricaomodal').val();
			
			$('#deleteModal').data('tarefa-desc', descricaoDelete); 
	        $('#deleteModal').data('tarefa-id', tarefaIdDelete); 
	    });

$('#deleteModalForm').submit(function(e) {
    e.preventDefault();  

	const tarefaIdDelete = $('#deleteModal').data('tarefa-id');  
	const DescricaoDelete = $('#deleteModal').data('tarefa-desc');

	const tarefaDelete = {
	   id: tarefaIdDelete,
	   descricao: DescricaoDelete
   	};
	
	deleteTarefa(tarefaIdDelete, tarefaDelete);
    $('#deleteModal').modal('hide');  
});
