
import { createTaskFromProject, deleteProject } from './api/project.js';


export function initProjectModal() {
	
	$(document).on('click', '.project-data', function () {
	  const projectId = $(this).data('id'); 
	  $('#projectModalBody').attr('data-id', projectId); 
	});
	
	$('#addTaskBtn').on('click', function() {
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

		$('#deleteModal').data('delete-type', 'project').data('id', projectId);
		$('#taskToDeleteDesc').text(`"${projectDesc}"`);
	});

	$('.confirmDeleteClass').on('click', function() {
		const projectId = $('#deleteModal').data('id');
		const type = $('#deleteModal').data('delete-type');
		console.log(projectId);

		if (projectId && type === 'project') {
			deleteProject(projectId);
		}

		$('#deleteModal').modal('hide');
	});
}
