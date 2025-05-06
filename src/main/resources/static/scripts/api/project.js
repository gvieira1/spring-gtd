
import { renderTaskList } from './task.js';
import { loadAllTasksForSidebarCount } from './sidebar.js'; 

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
			$('#categoryTitle').text("Projetos Ativos");
			renderActiveProjects(response.content);
		},
		error: function() {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar projetos.</div>');
		}

	});
}



function renderActiveProjects(projects, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	$container.empty();

	const pendingProjects = projects.filter(project => !project.done);

	if (pendingProjects.length === 0) {
		$container.html('<div class="alert alert-light">Sem projetos por enquanto. Aproveite!</div>');
		return;
	}

	pendingProjects.forEach(project => {
		const projectCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2 project-data" 
				data-bs-toggle="modal" data-bs-target="#projectModal" data-id="${project.id}" data-description="${project.description}">
				<div>
					 ${project.description}
				</div>
			</div>
		`);

		projectCard.on('click', function () {
			const projectId = $(this).data('id');
			const projectDesc = $(this).data('description');

			openProjectModal(projectId);
			$('#projectModalLabel').text(projectDesc);
		});

		$container.append(projectCard);
	});

}

export function openProjectModal(projectId) {

		$.ajax({
				url: `/api/project/${projectId}/tasks`,
				method: 'GET',
				dataType: 'json',
				success: function (response) {	
					renderTaskList(response.content, '#projectModalBody');		
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


