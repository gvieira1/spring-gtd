import { loadSelectOptions } from './estimatedTimes.js';
import { formatDateFromIso, updateSwitchLabel } from '/scripts/helpers.js';
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

	$.get('/api/moodle/check-moodle-sync')
		.done(function (isSynced) {
			if (!isSynced) {
				$('#taskList').html(`
					<div class="alert alert-light d-flex justify-content-between align-items-center">
						<span class="fs-6 fw-medium">Deseja sincronizar com o Moodle usando seu e-mail cadastrado?</span>
						<button class="btn btn-outline-secondary btn-modal-bg" id="syncMoodleBtn"><i class="bi bi-arrow-repeat fs-5"></i> Sincronizar</button>
					</div>
				`);

				$('#syncMoodleBtn').on('click', function () {
					$.post('/api/moodle/sync')
						.done(function (msg) {
							console.log('Sincronização com Moodle feita com sucesso:', msg);
							loadMoodleTasks();
						})
						.fail(xhr => {
							const response = xhr.responseJSON;
							console.error('Erro ao sincronizar com Moodle:', response?.error || xhr.statusText);
							let message = 'Erro ao verificar sincronização com o Moodle.';
									
							if (xhr.status === 401 && response?.error?.includes('não encontrado')) {
								message = 'Não encontramos seu usuário no Moodle com o e-mail cadastrado. Verifique ou entre em contato com o suporte.';
							}

							$('#taskList').html(`<div class="alert alert-danger">${message}</div>`);
							
						});
				});
			} else {
				fetchTasksFromMoodle()
					.then(response => {
						renderTasks({ tasks: response.content, showDone: false, showToggle: true });
					})
					.catch(() => {
						$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas do Moodle.</div>');
					});
			}
		})
		.fail(function () {
			$('#taskList').html('<div class="alert alert-danger">Erro ao verificar sincronização com o Moodle.</div>');
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

		const now = new Date();
		const deadlineDate = new Date(task.deadline);
		const isOverdue = isScheduled && deadlineDate < now;

		const badge = isScheduled 
			? `<span class="badge ${isOverdue ? 'bg-danger text-light' : 'bg-light text-dark'}">${formatDateFromIso(task.deadline)}</span>` 
			: `<span class="badge bg-light text-dark">${task.category.name}</span>`;

	    const checkbox = showToggle
		= `<input type="checkbox" class="form-check-input me-2" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#doneModal" ${task.done ? 'checked' : ''} ${task.done ? 'disabled' : ''}/>`
						
		const contextBadges = task.contexts.map(ctx =>
						  `<span class="badge bg-secondary me-1">${ctx.text}</span>`
		).join('');
						
		const taskCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2 ${statusClass}" 
				data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
				<div>
					${checkbox}${task.description}
				</div>
				<div class="d-flex gap-1">
				  ${contextBadges}
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
	
	$('#categorymodal').select2({
	   width: '100%'
	 });

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
		
		updateSwitchLabel($('#formSwitch1'), $('#switchLabel1'));
		updateSwitchLabel($('#formSwitch2'), $('#switchLabel2'));

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
		
		$('#contexts').empty().trigger('change'); 

		if (task.contexts && task.contexts.length > 0) {
		  const newOptions = task.contexts.map(c =>
		    new Option(c.text, c.id, true, true)
		  );
		  $('#contexts').append(newOptions).trigger('change');
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
			
		$('#categorymodal').val(task.category.id || '').trigger('change');

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

export function loadTasksByContext(){
	$('#navsearch').on('change', function () {
	  const selectedContexts = $(this).val(); 
	  if (!selectedContexts || selectedContexts.length === 0) {
	      setupSidebarNavigation();
	      return;
	    }
		$('#categoryTitle').html('<i class="bi bi-search me-2"></i>Por Contexto');

	  $.ajax({
	    url: '/api/tasks/by-contexts',
	    method: 'GET',
	    data: { contextIds: selectedContexts },
	    success: function (response) {
	      renderTasks({
				tasks: response,
				showDone: null,
				showToggle: true
			}); 
	    },
		error: function () {
			alert('Erro ao carregar contextos.');
		}
	  });
	});
	

}

function showCategoryToast(message = "Categoria alterada!") {
	const toastEl = document.getElementById('categoryToast');
	const toastBody = document.getElementById('categoryToastBody');

	toastBody.innerHTML = `<i class="bi bi-lightbulb me-2 fs-4"></i> ${message}`;

	const toast = new bootstrap.Toast(toastEl);
	toast.show();
}


