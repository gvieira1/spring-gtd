import { formatDateFromIso } from '/scripts/helpers.js';

export function loadWeeklyReport() {
	$('#categoryTitle').empty();
	const dashboard = `
		<div class="container-fluid " >
		  <div class="d-flex justify-content-between align-items-start mb-3">
		    <h2 class="fw-bold mb-4"><i class="bi bi-bar-chart-fill"></i> Relatório Semanal
		
			</h2>
			<p class="text-body-secondary fs-4 mb-3 fw-semibold">
			   Média diária de tarefas: 
			   <span id="mediaDiaria" class="fw-bold text-light"> </span>	   
			   <i class="bi bi-question-circle fs-6 " data-bs-toggle="tooltip" data-bs-placement="top" title="Com dados dos últimos 7 dias"></i>
			 </p>			 
		  </div>

		  <div class="row gx-2 gy-2 ">
		    <div class="col-md-6 col-xl-6 d-flex">
		      <div class="card shadow-sm rounded-4 p-3 w-100">
		        <h6 class="mb-2 text-secondary">Tarefas por Assunto</h6>
		        <canvas id="graficoAssunto" class="flex-grow-1" style="height: 100%; max-height: 240px;"></canvas>
		      </div>
		    </div>
		    <div class="col-md-6 col-xl-6 d-flex">
		      <div class="card shadow-sm rounded-4 p-3 w-100">
		        <h6 class="mb-2 text-secondary">Tarefas por Prioridade</h6>
		        <canvas id="graficoPrioridade" class="flex-grow-1" style="height: 100%; max-height: 240px;"></canvas>
		      </div>
		    </div>
		    <div class="col-md-6 col-xl-6 d-flex">
		      <div class="card shadow-sm rounded-4 p-3 w-100">
		        <h6 class="mb-2 text-secondary">Distribuição por Tempo Estimado</h6>
		        <canvas id="graficoTempo" class="flex-grow-1" style="height: 100%; max-height: 240px;"></canvas>
		      </div>
		    </div>
		    <div class="col-md-6 col-xl-6 d-flex">
		      <div class="card shadow-sm rounded-4 p-3 w-100">
		        <h6 class="mb-2 text-secondary">Tarefas Concluídas por Dia</h6>
		        <canvas id="lineChart" class="flex-grow-1" style="height: 100%; max-height: 240px;"></canvas>
		      </div>
		    </div>
		  </div>
		</div>
	`;

	$.ajax({
		url: '/api/tasks/weekly-report',
		method: 'GET',
		success: function (data) {
			
			if (data.totalTasks === 0) {
			            $('#taskList').empty(); 
			            $('#taskList').html(`
							<h2 class="fw-bold mb-4"><i class="bi bi-bar-chart-fill"></i> Relatório Semanal</h2>
			                <div class="card text-center p-4 shadow-sm border-0">
			                    <h5 class="mb-3">Sem dados para mostrar</h5>
			                    <p>Você ainda não concluiu nenhuma tarefa nos últimos 7 dias.</p>
			                    <p class="text-muted">Marque tarefas como concluídas para acompanhar seu progresso aqui <i class="bi bi-rocket-takeoff"></i></p>
			                </div>
			            `).show();
			            return;
			        }
			$('#taskList').html(dashboard);
			$('#mediaDiaria').text(data.dailyAverage.toFixed(2));
			
			const roxo1 = '#8179B3';
			const roxo2 = '#6667ab';
			const roxo3 = '#a6a1d4';
			const roxoClaro = '#c9c2e6';
			

			const sortedKeys = Object.keys(data.tasksCompletedByDay).sort((a, b) => new Date(a) - new Date(b));
			const formattedLabels = sortedKeys.map(formatDateFromIso);
			const orderedData = sortedKeys.map(key => data.tasksCompletedByDay[key]);
			new Chart(document.getElementById("lineChart"), {
				type: 'line',
				data: {
					labels: formattedLabels,
					datasets: [{
						label: 'Concluídas',
						data: orderedData,
						borderColor: roxo1,
						backgroundColor: roxoClaro,
						fill: true,
						tension: 0.4
					}]
				},
				options: {
					scales: { y: { beginAtZero: true } },
					plugins: { legend: { display: false } }
				}
			});

			new Chart(document.getElementById('graficoAssunto'), {
			  type: 'bar',
			  data: {
				labels: Object.keys(data.tasksBySubject).map(label => label === '' ? 'Sem assunto' : label),
			    datasets: [{
			      label: 'Quantidade',
			      data: Object.values(data.tasksBySubject),
			      backgroundColor: [roxoClaro, roxo3, roxo2, roxo1]
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

			new Chart(document.getElementById('graficoPrioridade'), {
			  type: 'doughnut',
			  data: {
			    labels: ['Alta Prioridade', 'Normal'],
			    datasets: [{
			      data: [data.tasksByPriority.true || 0, data.tasksByPriority.false || 0],
			      backgroundColor: [roxo2, roxoClaro]
			    }]
			  },
			  options: {
			    plugins: { legend: { labels: { color: '#666' } } }
			  }
			});

			new Chart(document.getElementById('graficoTempo'), {
			      type: 'pie',
			      data: {
			        labels: Object.keys(data.tasksByEstimatedTime),
			        datasets: [{
			          data: Object.values(data.tasksByEstimatedTime),
			          backgroundColor: [roxoClaro, roxo3, roxo2, roxo1]
			        }]
			      },
			      options: {
			        plugins: { legend: { labels: { color: '#666' } } }
			      }
			    });
			  },
		error: function () {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar relatório semanal.</div>');
		}
	});
}
