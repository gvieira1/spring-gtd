import { formatDateFromIso } from '/scripts/helpers.js';

export function loadWeeklyReport() {
	$('#categoryTitle').empty();

	$.ajax({
		url: '/api/tasks/weekly-report',
		method: 'GET',
		success: function (data) {
			if (data.totalTasks === 0) {
				renderNoDataMessage();
				return;
			}

			renderDashboardLayout();
			$('#mediaDiaria').text(data.dailyAverage.toFixed(2));

			renderLineChart(data.tasksCompletedByDay);
			renderSubjectChart(data.tasksBySubject);
			renderPriorityChart(data.tasksByPriority);
			renderEstimatedTimeChart(data.tasksByEstimatedTime);
		},
		error: function () {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar relatório semanal.</div>');
		}
	});
}

function renderNoDataMessage() {
	$('#taskList').html(`
		<h2 class="fw-bold mb-4"><i class="bi bi-bar-chart-fill"></i> Relatório Semanal</h2>
		<div class="card text-center p-4 shadow-sm border-0">
			<h5 class="mb-3">Sem dados para mostrar</h5>
			<p>Você ainda não concluiu nenhuma tarefa nos últimos 7 dias.</p>
			<p class="text-muted">Marque tarefas como concluídas para acompanhar seu progresso aqui <i class="bi bi-rocket-takeoff"></i></p>
		</div>
	`);
}

function renderDashboardLayout() {
	$('#taskList').html(`
		<div class="container-fluid">
			<div class="d-flex justify-content-between align-items-start mb-3">
				<h2 class="fw-bold mb-4"><i class="bi bi-bar-chart-fill"></i> Relatório Semanal</h2>
				<p class="text-body-secondary fs-4 mb-3 fw-semibold">
					Média diária de tarefas: 
					<span id="mediaDiaria" class="fw-bold text-light"></span>	   
					<i class="bi bi-question-circle fs-6" data-bs-toggle="tooltip" data-bs-placement="top" title="Com dados dos últimos 7 dias"></i>
				</p>			 
			</div>
			<div class="row gx-2 gy-2">
				${getChartCard('Tarefas por Assunto', 'graficoAssunto')}
				${getChartCard('Tarefas por Prioridade', 'graficoPrioridade')}
				${getChartCard('Distribuição por Tempo Estimado', 'graficoTempo')}
				${getChartCard('Tarefas Concluídas por Dia', 'lineChart')}
			</div>
		</div>
	`);
}

function getChartCard(title, canvasId) {
	return `
		<div class="col-md-6 col-xl-6 d-flex">
			<div class="card shadow-sm rounded-4 p-3 w-100">
				<h6 class="mb-2 text-secondary">${title}</h6>
				<canvas id="${canvasId}" class="flex-grow-1" style="height: 100%; max-height: 240px;"></canvas>
			</div>
		</div>
	`;
}

const colors = {
	roxo1: '#8179B3',
	roxo2: '#6667ab',
	roxo3: '#a6a1d4',
	roxoClaro: '#c9c2e6'
};

function renderLineChart(tasksByDay) {
	const sortedKeys = Object.keys(tasksByDay).sort((a, b) => new Date(a) - new Date(b));
	const labels = sortedKeys.map(formatDateFromIso);
	const values = sortedKeys.map(key => tasksByDay[key]);

	new Chart(document.getElementById("lineChart"), {
		type: 'line',
		data: {
			labels,
			datasets: [{
				label: 'Concluídas',
				data: values,
				borderColor: colors.roxo1,
				backgroundColor: colors.roxoClaro,
				fill: true,
				tension: 0.4
			}]
		},
		options: {
			scales: { y: { beginAtZero: true } },
			plugins: { legend: { display: false } }
		}
	});
}

function renderSubjectChart(tasksBySubject) {
	const labels = Object.keys(tasksBySubject).map(label => label === '' ? 'Sem assunto' : label);
	const values = Object.values(tasksBySubject);

	new Chart(document.getElementById('graficoAssunto'), {
		type: 'bar',
		data: {
			labels,
			datasets: [{
				label: 'Quantidade',
				data: values,
				backgroundColor: [colors.roxoClaro, colors.roxo3, colors.roxo2, colors.roxo1]
			}]
		},
		options: {
			plugins: { legend: { display: false } },
			scales: {
				y: { beginAtZero: true, ticks: { color: '#666' } },
				x: { ticks: { color: '#666' } }
			}
		}
	});
}

function renderPriorityChart(tasksByPriority) {
	const values = [tasksByPriority.true || 0, tasksByPriority.false || 0];

	new Chart(document.getElementById('graficoPrioridade'), {
		type: 'doughnut',
		data: {
			labels: ['Alta Prioridade', 'Normal'],
			datasets: [{
				data: values,
				backgroundColor: [colors.roxo2, colors.roxoClaro]
			}]
		},
		options: {
			plugins: { legend: { labels: { color: '#666' } } }
		}
	});
}

function renderEstimatedTimeChart(tasksByEstimatedTime) {
	const labels = Object.keys(tasksByEstimatedTime);
	const values = Object.values(tasksByEstimatedTime);

	new Chart(document.getElementById('graficoTempo'), {
		type: 'pie',
		data: {
			labels,
			datasets: [{
				data: values,
				backgroundColor: [colors.roxoClaro, colors.roxo3, colors.roxo2, colors.roxo1]
			}]
		},
		options: {
			plugins: { legend: { labels: { color: '#666' } } }
		}
	});
}
