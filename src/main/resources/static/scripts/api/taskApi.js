
import { loadAllTasksForSidebarCount, setupSidebarNavigation } from './sidebar.js'; 
import { loadProjectOptions } from '../modalHandlers/taskFormUI.js';
import { showCategoryToast } from '/scripts/service/taskRenderer.js';

export function reopenTask(taskId){
	$.ajax({
	    url: `/api/tasks/${taskId}/reopen`,
	    method: 'PUT',
	    success: function () {
	      $('#taskForm input, #taskForm select, #taskForm textarea').prop('disabled', false);
	      $('#completedWarning').addClass('d-none');
	      $('#reopenTaskBtn').addClass('d-none');
		  $('#saveChangesBtn').removeClass('d-none'); 

		  loadAllTasksForSidebarCount();
		  setupSidebarNavigation();
	    },
	    error: function () {
	      alert('Erro ao reabrir a tarefa.');
	    }
	  });
}

export function createTask(text) {
	$.ajax({
		url: '/api/tasks',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text }),
		success: function() {
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();	
		},
		error: function() {
			alert('Erro ao criar tarefa');
		}
	}).always(function() {
		$('#taskOrProjectModal').modal('hide');
		$('#newAction').val('');
	});

}

export function updateTask(taskId, updatedTask) {
	
	 const originalCategory = $('#taskModal').data('originalCategory');
	  
    $.ajax({
        url: `/api/tasks/${taskId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedTask),
        success: function() {
            
			$(`.task-card[data-id="${taskId}"]`).remove();
			const newCategory = $('#categorymodal').val();
			$('#taskModal').modal('hide');
			if (originalCategory !== newCategory) {
				const newCategoryName = $('#categorymodal option:selected').text();
				showCategoryToast(`A tarefa foi movida para <strong>${newCategoryName}</strong>`);	 
			}
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Erro:", textStatus, errorThrown, jqXHR);
            alert('Erro ao atualizar a tarefa: ' + textStatus);
        }
    });
}

export function removeProjectFromTask(taskId) {

	$.ajax({
		url: `/api/tasks/${taskId}/remove-project`,
		method: 'PATCH',
		success: function() {
			loadAllTasksForSidebarCount();
			loadProjectOptions();
			setupSidebarNavigation();
			showCategoryToast("Tarefa desvinculada do projeto!")
		},
		error: function(xhr, status, error) {
			console.log('Erro ao remover tarefa:', error, xhr, status);
			alert('Ocorreu um erro ao tentar remover a tarefa.');
		}
	});
}


export function updateDone(taskId) {

	$.ajax({
		url: `/api/tasks/${taskId}/complete`,
		method: 'PATCH',
		success: function() {
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
			showCategoryToast("Tarefa Concluída!")
			
		},
		error: function(xhr, status, error) {
			console.error('Erro ao atualizar tarefa feita:', error, xhr, status);
			alert('Ocorreu um erro ao tentar atualizar a tarefa.');
		}
	});
}


export function deleteTask(taskId) {

    $.ajax({
        url: `/api/tasks/${taskId}`,
        type: 'DELETE',
        success: function() {   
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
		
        },
        error: function(xhr, status, error) {
            console.error('Erro ao excluir a tarefa:', error, xhr, status);
            alert('Ocorreu um erro ao tentar excluir a tarefa.');
        }
    });
}



