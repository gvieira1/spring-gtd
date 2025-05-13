
import { renderTasks } from './task.js';
import { loadAllTasksForSidebarCount, setupSidebarNavigation } from './sidebar.js'; 

export function createProject(text) {
	$.ajax({
		url: '/api/project',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text }),
		success: function() {
			console.log('Projeto criado');
			fetchActiveProjects();
		},
		error: function() {
			alert('Erro ao criar projeto');
		}
	}).always(function() {
		$('#taskOrProjectModal').modal('hide');
		$('#newAction').val('');
	});
}

export function createTaskFromProject(projectId, text) {

	$.ajax({
		url: `/api/project/${projectId}/tasks`,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text }),
		success: function() {
			console.log('Tarefa de projeto criada');
			openProjectModal(projectId);
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
		},
		error: function() {
			alert('Erro ao criar tarefa no projeto');
		}
	}).always(function() {
		$('#newTask').val('');
	});
}

export function deleteProject(projectId) {

    $.ajax({
        url: `/api/project/${projectId}`,
        type: 'DELETE',
        success: function() {
                console.log('Projeto excluído com sucesso.');
				$('#projectModal').modal('hide'); 
				$('#deleteModal').modal('hide');
				fetchActiveProjects();       
        },
        error: function(xhr, status, error) {
            console.error('Erro ao excluir o projeto:', error, xhr, status);
            alert('Ocorreu um erro ao tentar excluir o projeto.');
        }
    });
}

export function fetchActiveProjects() {
	$.ajax({
		url: `/api/project`,
		method: 'GET',
		dataType: 'json',
		success: function(response) {
			$('#categoryTitle').text("Projetos");
			renderActiveProjects(response.content);
		},
		error: function() {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar projetos.</div>');
		}

	});
}

function renderActiveProjects(projects, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	setupProjectListHeader($container, projects);
	renderProjectCards(projects, $container);
    backToProjectModal();	
}


function setupProjectListHeader($container, projects) {
	$container.empty();

	const header = $(`
		<div class="form-check form-switch mb-3">
			<input class="form-check-input" type="checkbox" id="showCompletedProjects">
			<label class="form-check-label" for="showCompletedProjects">Exibir projetos concluídos</label>
		</div>
	`);

	$container.append(header);

	$container.on('change', '#showCompletedProjects', function () {
		renderProjectCards(projects, $container);
	});
}

function renderProjectCards(projects, $container) {
	$container.find('.project-data').remove();
	$('body').attr('data-from-project', 'true');

	const showCompleted = $('#showCompletedProjects').is(':checked');
	const visibleProjects = showCompleted ? projects : projects.filter(p => !p.done);

	if (visibleProjects.length === 0) {
		$container.append('<div class="alert alert-light project-data">Sem projetos por enquanto. Aproveite!</div>');
		return;
	}

	visibleProjects.forEach(project => {
		const statusClass = project.done ? 'text-muted text-decoration-line-through' : '';
		const projectCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2 project-data ${statusClass}" 
				data-bs-toggle="modal" data-bs-target="#projectModal" data-id="${project.id}" data-description="${project.description}">
				<div>${project.description}</div>
			</div>
		`);

		projectCard.on('click', function () {
			const projectId = $(this).data('id');
			const projectDesc = $(this).data('description');
			
			$('#projectModal').attr('data-project-id', projectId);
			openProjectModal(projectId);
			$('#projectModalLabel').text(projectDesc);
		});

		$container.append(projectCard);
	});
}

function backToProjectModal() {
	$(document).on('click', '#backToProjectBtn', function() {
		const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
		taskModal.hide();

		const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
		
		$('.modal-backdrop').remove();
		$('body').removeClass('modal-open');
		const projectId = $('#projectModal').attr('data-project-id');
		openProjectModal(projectId);
		projectModal.show();
	});
	
	$(document).on('hidden.bs.modal', '#projectModal', function() {
		$('body').removeAttr('data-from-project');
	});
}

export function openProjectModal(projectId) {

	$('body').attr('data-from-project', 'true');
	
		$.ajax({
				url: `/api/project/${projectId}/tasks`,
				method: 'GET',
				dataType: 'json',
				success: function (response) {	
					window.currentProjectTasks = response.content;
					renderTasks({
						tasks: response.content,
						containerSelector: '#projectModalBody',
						showDone: null,
						showToggle: true
					});
				},
				error: function() {
				   $('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas deste projeto.</div>');
			}				
		});
}

export function loadProjectOptions(selectedId = null) {
    $.get('/api/project', function(activeProjects) {
        const $select = $('#getprojects');
        $select.empty();  
		$select.append(`<option value="" ${selectedId === null ? 'selected' : ''}>Sem projeto associado</option>`);
		
        activeProjects.content.forEach(function(project) {
            const selectedAttr = (project.id === selectedId) ? 'selected' : '';
            $select.append(
                `<option value="${project.id}" ${selectedAttr}>${project.description}</option>`
            );
        });
    }).fail(function() {
        alert("Erro ao carregar projetos.");
    });
}

