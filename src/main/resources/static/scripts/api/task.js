import { loadSelectOptions } from './estimatedTimes.js';
import { getCurrentCategoryFromURL } from '/scripts/helpers.js';
import { loadAllTasksForSidebarCount } from './sidebar.js'; 

export function loadInboxTasks(category = null) {
	
		$('#taskList').empty();
		
		const title = category || "Entrada"; 
		$('#categoryTitle').text(title);
		
		const queryParam = category ? `?category=${encodeURIComponent(category)}` : '';
		const url = `/api/tasks${queryParam}`;
		
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'json',
			success: function(response) {
				console.log(response);
				const tasks = response.content;
				const pendingTasks = tasks.filter(task => !task.done);

				
				if (pendingTasks.length === 0) {
				        $('#taskList').html('<div class="alert alert-light ">Sem tarefas nesta categoria. Tudo tranquilo por aqui! </div>');
				        return;
				      }

				pendingTasks.forEach(task => {
						const taskCard = $(`
	
            <div class="task-card d-flex justify-content-between align-items-center mb-2" 
                data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
              <div>
                <input type="checkbox" class="form-check-input me-2 " data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#doneModal"/> ${task.description}
				
              </div>
              <span class="badge bg-light text-dark">${task.category.name}</span>
            </div>
          `);

						taskCard.on('click', function() {
							const tarefaId = $(this).data('id');
							openEditModal(tarefaId);
						});

						$('#taskList').append(taskCard);
					
				});

				$('#doneModal').on('hidden.bs.modal', function () {
						     $('input[type="checkbox"][data-bs-toggle="modal"]').prop('checked', false);
						});

			},
			error: function() {
				$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas.//</div>');
			}
		});
}

function openEditModal(tarefaId) {
  $('#taskForm')[0].reset();

  $.get(`/api/tasks/${tarefaId}`, function (task) {
    $('#descriptionmodal').val(task.description);
    $('#formSwitch1').prop('checked', task.priority === true);
    $('#formSwitch2').prop('checked', task.delegated === true);

	if (task.deadline) {
	  $('#deadlinemodal').val(task.deadline);
	} 

    if (task.subject) {
      $('#subjectmodal').val(task.subject);
    }
	if (task.estimatedTime) {
	  loadSelectOptions(task.estimatedTime.id);
	} else {
	  loadSelectOptions(); 
	}


    $('#categorymodal').val(task.category?.id || '');
    $('#taskId').data('id', task.id);
  }).fail(function () {
    alert('Erro ao carregar os dados da tarefa.');
  });
}


export function deleteTask(taskId) {

    $.ajax({
        url: `/api/tasks/${taskId}`,
        type: 'DELETE',
        success: function(_, xhr) {
            if (xhr.status === 204 || xhr.status === 200) {
                console.log('Tarefa excluída com sucesso.');
				loadInboxTasks(getCurrentCategoryFromURL()); 
            } else {
                alert('Erro inesperado. Código de status: ' + xhr.status);
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro ao excluir a tarefa:', error, xhr, status);
            alert('Ocorreu um erro ao tentar excluir a tarefa.');
        }
    });
}


export function updateDone(taskId) {

	$.ajax({
		url: `/api/tasks/${taskId}/complete`,
		method: 'PATCH',
		success: function() {
			console.log('Tarefa marcada como feita:', taskId);
			loadInboxTasks(getCurrentCategoryFromURL()); 
			
		},
		error: function(xhr, status, error) {
			console.log('Erro ao atualizar tarefa feita:', error, xhr, status);
			alert('Ocorreu um erro ao tentar atualizar a tarefa.');
		}
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
			console.log(originalCategory);
			console.log(newCategory);
			if (originalCategory !== newCategory) {
				const newCategoryName = $('#categorymodal option:selected').text();
				showCategoryToast(`A tarefa foi movida para <strong>${newCategoryName}</strong>`);	 
			}
			loadInboxTasks(getCurrentCategoryFromURL()); 
			loadAllTasksForSidebarCount();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Erro:", textStatus, errorThrown, jqXHR);
            alert('Erro ao atualizar a tarefa: ' + textStatus);
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
			console.log('Tarefa criada');
			loadInboxTasks(getCurrentCategoryFromURL()); 
		},
		error: function() {
			alert('Erro ao criar tarefa');
		}
	}).always(function() {
		$('#taskOrProjectModal').modal('hide');
		$('#newAction').val('');
	});

}

function showCategoryToast(message = "Categoria alterada!") {
  const toastEl = document.getElementById('categoryToast');
  const toastBody = document.getElementById('categoryToastBody');

  toastBody.innerHTML = `<i class="bi bi-lightbulb me-2 fs-4"></i> ${message}`;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}


