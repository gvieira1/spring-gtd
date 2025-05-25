import { fetchProjectTasks } from '../api/projectApi.js';
import { renderTasks } from '../service/taskRenderer.js';
import { createTaskFromProject, deleteProject } from '../service/projectForm.js';

export function openProjectModal(projectId) {
	$('body').attr('data-from-project', 'true');

	fetchProjectTasks(projectId)
		.done(response => {
			window.currentProjectTasks = response.content;
			renderTasks({
				tasks: response.content,
				containerSelector: '#projectModalBody',
				showDone: null,
				showToggle: true
			});
		})
		.fail(() => {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas deste projeto.</div>');
		});
}

export function backToProjectModal() {
	$(document).on('click', '#backToProjectBtn', function () {
		const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
		taskModal.hide();	

		const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
		$('.modal-backdrop').remove();
		$('body').removeClass('modal-open');

		const projectId = $('#projectModal').attr('data-project-id');
		openProjectModal(projectId);
		projectModal.show();
	});

	$(document).on('hidden.bs.modal', '#projectModal', function () {
		$('body').removeAttr('data-from-project');
	});
}

export function initProjectModal() {
	$(document).on('click', '.project-data', function () {
		const projectId = $(this).data('id'); 
		$('#projectModalBody').attr('data-id', projectId); 
	});

	$('#addTaskBtn').on('click', function () {
		const inputText = $('#newTask').val().trim();
		const projectId = $('#projectModalBody').data('id'); 

		if (inputText) {
			createTaskFromProject(projectId, inputText);
		}
	});
}

export function initDeleteProjectModalHandlers() {
	$('#deleteProjectBtn').on('click', function () {
		const projectId = $('#projectModalBody').data('id');
		const projectDesc = $('#projectModalLabel').text();

		$('#deleteModal')
			.data('delete-type', 'project')
			.data('id', projectId);
			
		$('#taskToDeleteDesc').text(`"${projectDesc}"`);
	});

	$('.confirmDeleteClass').on('click', function () {
		const projectId = $('#deleteModal').data('id');
		const type = $('#deleteModal').data('delete-type');

		if (projectId && type === 'project') {
			deleteProject(projectId);
		}

		$('#deleteModal').modal('hide');
	});
}
