export function createProjectRequest(text) {
	return $.ajax({
		url: '/api/project',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text })
	});
}

export function createTaskInProjectRequest(projectId, text) {
	return $.ajax({
		url: `/api/project/${projectId}/tasks`,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text })
	});
}

export function deleteProjectRequest(projectId) {
	return $.ajax({
		url: `/api/project/${projectId}`,
		type: 'DELETE'
	});
}

export function fetchProjects() {
	return $.ajax({
		url: '/api/project',
		method: 'GET',
		dataType: 'json'
	});
}

export function fetchProjectTasks(projectId) {
	return $.ajax({
		url: `/api/project/${projectId}/tasks`,
		method: 'GET',
		dataType: 'json'
	});
}
