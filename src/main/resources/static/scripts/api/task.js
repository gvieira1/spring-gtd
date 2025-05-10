import { loadSelectOptions } from './estimatedTimes.js';
import { formatDateFromIso } from '/scripts/helpers.js';
import { loadAllTasksForSidebarCount, setupSidebarNavigation } from './sidebar.js'; 
import { loadProjectOptions } from './project.js';


export function fetchPendingTasks(){
	$.ajax({
			url: `/api/tasks`,
			method: 'GET',
			dataType: 'json',
			success: function (response) {
				$('#categoryTitle').text("Tarefas Pendentes");			
				renderTasks({ tasks: response.content, showDone: false, showToggle: true });	
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
			renderTasks({ tasks: response.content, showDone: false, showToggle: true });
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
			renderTasks({ tasks: response.content, showDone: false, showToggle: true });

			
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
			renderTasks({ tasks: response.content, showDone: true, showToggle: false });
		})
		.catch(() => {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas concluídas.</div>');
		});
}

export function renderTasks({ tasks, containerSelector = '#taskList', showDone = false, showToggle = true }) {
	const $container = $(containerSelector);
	$container.empty();

	const filteredTasks = typeof showDone === 'boolean'
		? tasks.filter(task => task.done === showDone)
		: tasks;


	if (filteredTasks.length === 0) {
		const message = showDone 
			? 'Sem tarefas concluídas nesta categoria. Tudo feito!' 
			: 'Sem tarefas nesta categoria. Tudo tranquilo por aqui!';
		$container.html(`<div class="alert alert-light">${message}</div>`);
		return;
	}

	filteredTasks.forEach(task => {
		const isScheduled = task.category?.name === 'Agendado';
		
		const statusClass = task.done ? 'text-muted text-decoration-line-through' : '';
		
		const isProject = task.project != null ? `<span class="badge bg-light text-dark fs-7">${'Projeto'}</span>` : '';

		const badge = isScheduled 
			? `<span class="badge bg-light text-dark ">${formatDateFromIso(task.deadline)}</span>` 
			: `<span class="badge bg-light text-dark ">${task.category.name}</span>`;	

	    const checkbox = showToggle
						? `<input type="checkbox" class="form-check-input me-2" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#doneModal" ${task.done ? 'checked' : ''}/>`
						: `<input type="checkbox" class="form-check-input me-2" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#doneModal" ${task.done ? 'checked' : ''} disabled/>`;
							
		const taskCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2 ${statusClass}" 
				data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
				<div>
					${checkbox}${task.description}
				</div>
				<div class="d-flex gap-1">
				  ${isProject}
				  ${badge}
				</div>

			</div>
		`);

		taskCard.on('click', function () {
			const tarefaId = $(this).data('id');
			openEditModal(tarefaId);
			
			const taskDesc = task.description;
			$('#taskModalLabel').text(taskDesc);
		});

		$container.append(taskCard);
	});

	if (showToggle) {
		$('#doneModal').on('hidden.bs.modal', function () {
			$('input[type="checkbox"][data-bs-toggle="modal"]').prop('checked', false);
		});
	}
}



export function openEditModal(tarefaId) {
	$('#taskForm')[0].reset();
	
	const fromProject = $('body').attr('data-from-project') === 'true';
	 if (fromProject) {
	   $('#backToProjectBtn').removeClass('d-none');
	   $('#closeTaskModalBtn').addClass('d-none');
	 } else {
	   $('#backToProjectBtn').addClass('d-none');
	   $('#closeTaskModalBtn').removeClass('d-none');
	 }
	
	$.get(`/api/tasks/${tarefaId}`, function(task) {

		autocompleteSubjects();
		
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
		
		if (task.project) {
				loadProjectOptions(task.project.id);
			} else {
				loadProjectOptions();
		}
		
		if (task.done) {
		      $('#taskForm input, #taskForm select, #taskForm textarea').prop('disabled', true);
		      $('#completedWarning').removeClass('d-none');
		      $('#reopenTaskBtn').removeClass('d-none');
			  $('#saveChangesBtn').addClass('d-none');
		    } else {
		      $('#taskForm input, #taskForm select, #taskForm textarea').prop('disabled', false);
		      $('#completedWarning').addClass('d-none');
		      $('#reopenTaskBtn').addClass('d-none');
			  $('#saveChangesBtn').removeClass('d-none'); 
		    }

		$('#categorymodal').val(task.category?.id || '');
		$('#taskId').data('id', task.id);
	})
		.fail(function() {
			alert('Erro ao carregar os dados da tarefa.');
		});
}


export function deleteTask(taskId) {

    $.ajax({
        url: `/api/tasks/${taskId}`,
        type: 'DELETE',
        success: function() {   
            console.log('Tarefa excluída com sucesso.');
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
		
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
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
			showCategoryToast("Tarefa Concluída!")
			
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

			loadAllTasksForSidebarCount();
			setupSidebarNavigation();

			
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

 function autocompleteSubjects(){
	
	$.ajax({
	    url: '/api/tasks/subjects',
	    method: 'GET',
	    success: function(data) {
	        $("#subjectmodal").autocomplete({
	            source: data,
				minLength: 0
	        });
	    }
	});
	
	$("#subjectmodal").on("focus", function () {
	    $(this).autocomplete("search", "");
	});

}

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

function showCategoryToast(message = "Categoria alterada!") {
  const toastEl = document.getElementById('categoryToast');
  const toastBody = document.getElementById('categoryToastBody');

  toastBody.innerHTML = `<i class="bi bi-lightbulb me-2 fs-4"></i> ${message}`;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}


