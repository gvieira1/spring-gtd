import { createProjectRequest, createTaskInProjectRequest, deleteProjectRequest } from '../api/projectApi.js';
import { fetchActiveProjects } from './projectRenderer.js';
import { openProjectModal } from '../modalHandlers/projectModals.js';
import { loadAllTasksForSidebarCount, setupSidebarNavigation } from '../api/sidebar.js';

export function createProject(text) {
	createProjectRequest(text)
		.done(() => fetchActiveProjects())
		.fail(() => alert('Erro ao criar projeto'))
		.always(() => {
			$('#taskOrProjectModal').modal('hide');
			$('#newAction').val('');
		});
}

export function createTaskFromProject(projectId, text) {
	createTaskInProjectRequest(projectId, text)
		.done(() => {
			openProjectModal(projectId);
			loadAllTasksForSidebarCount();
			setupSidebarNavigation();
		})
		.fail(() => alert('Erro ao criar tarefa no projeto'))
		.always(() => $('#newTask').val(''));
}

export function deleteProject(projectId) {
	deleteProjectRequest(projectId)
		.done(() => {
			$('#projectModal').modal('hide');
			$('#deleteModal').modal('hide');
			fetchActiveProjects();
		})
		.fail(() => alert('Erro ao excluir projeto'));
}

