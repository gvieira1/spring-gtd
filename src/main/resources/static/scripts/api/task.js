import { loadSelectOptions } from './estimatedTimes.js';
import { getCurrentCategoryFromURL, formatDateFromIso } from '/scripts/helpers.js';
import { loadAllTasksForSidebarCount } from './sidebar.js'; 


export function fetchPendingTasks(){
	$.ajax({
			url: `/api/tasks`,
			method: 'GET',
			dataType: 'json',
			success: function (response) {
				$('#categoryTitle').text("Tarefas Pendentes");			
				renderTaskList(response.content);		
			},
			error: function() {
			   $('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas pendentes.</div>');
		}
			
		});
}


function fetchTasksByCategory(category = null) {
	const queryParam = category ? `?category=${encodeURIComponent(category)}` : '';
	const url = `/api/tasks${queryParam}`;

	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	});
}

export function loadInboxTasks(category = null) {
	const title = category || "Entrada";
	$('#categoryTitle').text(title);

	fetchTasksByCategory(category)
		.then(response => {
			console.log(response);
			renderTaskList(response.content);
		})
		.catch(() => {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas.</div>');
		});
}

function fetchTasksFromMoodle() {
	const url = `/api/moodle/sync-tasks`;

	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	});
}

export function loadMoodleTasks() {
	$('#categoryTitle').text('Moodle');

	fetchTasksFromMoodle()
		.then(response => {
			console.log(response);
			renderTaskList(response.content);
		})
		.catch(() => {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas do Moodle.</div>');
		});
}

function fetchTasksDone() {
	const url = `/api/tasks`;

	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	});
}

export function loadDoneTasks() {
	$('#categoryTitle').text('Concluídas');

	fetchTasksDone()
		.then(response => {
			console.log(response);
			renderDoneTasks(response.content);
		})
		.catch(() => {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas concluídas.</div>');
		});
}


function renderTaskList(tasks, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	$container.empty();

	const pendingTasks = tasks.filter(task => !task.done);

	if (pendingTasks.length === 0) {
		$container.html('<div class="alert alert-light">Sem tarefas nesta categoria. Tudo tranquilo por aqui!</div>');
		return;
	}

	pendingTasks.forEach(task => {
		const isScheduled = task.category?.name === 'Agendado';

		const badge = isScheduled ? `<span class="badge bg-light text-dark">${formatDateFromIso(task.deadline)}</span>`: `<span class="badge bg-light text-dark">${task.category.name}</span>`;
					
		const taskCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2" 
				data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
				<div>
					<input type="checkbox" class="form-check-input me-2" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#doneModal"/> ${task.description}
				</div>
				${badge}
			</div>
		`);

		taskCard.on('click', function () {
			const tarefaId = $(this).data('id');
			openEditModal(tarefaId);
		});

		$container.append(taskCard);
	});

	$('#doneModal').on('hidden.bs.modal', function () {
		$('input[type="checkbox"][data-bs-toggle="modal"]').prop('checked', false);
	});
}

function renderDoneTasks(tasks, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	$container.empty();

	const completedTasks = tasks.filter(task => task.done);

	if (completedTasks.length === 0) {
		$container.html('<div class="alert alert-light">Sem tarefas nesta categoria. Aproveite para criar a primeira!</div>');
		return;
	}

	completedTasks.forEach(task => {
		const isScheduled = task.category?.name === 'Agendado';

		const badge = isScheduled ? `<span class="badge bg-light text-dark">${formatDateFromIso(task.deadline)}</span>`: `<span class="badge bg-light text-dark">${task.category.name}</span>`;
					
		const taskCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2" 
				data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
				<div>
					${task.description}
				</div>
				${badge}
			</div>
		`);

		taskCard.on('click', function () {
			const tarefaId = $(this).data('id');
			openEditModal(tarefaId);
		});

		$container.append(taskCard);
	});


}


function openEditModal(tarefaId) {
  $('#taskForm')[0].reset();

  $.get(`/api/tasks/${tarefaId}`, function (task) {
    $('#descriptionmodal').val(task.description);
    $('#formSwitch1').prop('checked', task.priority === true);
    $('#formSwitch2').prop('checked', task.delegated === true);

	if (task.deadline) {
	const isoFormat = formatDateFromIso(task.deadline);
	$('#deadlinemodal').val(isoFormat);
	 
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


