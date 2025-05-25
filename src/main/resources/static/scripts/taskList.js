import { renderTasks } from './service/taskRenderer.js';


function fetchTasksByCategory(category = null) {
	const queryParam = category ? `?category=${encodeURIComponent(category)}` : '';
	const url = `/api/tasks${queryParam}`;
	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	});
}

function fetchTasksDone() {
	const url = `/api/tasks?size=1000`;
	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	});
}

export function fetchPendingTasks(){
	$.ajax({
			url: `/api/tasks?size=1000`,
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
