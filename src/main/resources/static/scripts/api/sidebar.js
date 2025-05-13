import { getCurrentCategoryFromURL } from '/scripts/helpers.js';
import { checkAndNotifyUpcomingTasks } from './notifications.js';
import { loadMoodleTasks, loadInboxTasks, loadDoneTasks, fetchPendingTasks} from './task.js';
import { fetchActiveProjects } from './project.js';
import { loadCalendarApi } from './calendar.js';
import { loadWeeklyReport } from './report.js';

const taskLoaders = {
	'categoria': loadInboxTasks,
	'moodle': loadMoodleTasks,
	'concluidas': loadDoneTasks,
	'pendentes': fetchPendingTasks,
	'projetos': fetchActiveProjects,
	'calendario': loadCalendarApi,
	'relatorio': loadWeeklyReport	
};

export function setupSidebarNavigation() {
	$('.history-btn').on('click', function (e) {
		e.preventDefault();

		const targetPath = $(this).data('href');
		const categoryName = $(this).data('categoria') || null;
		const source = $(this).data('source') || 'categoria';

		if (!targetPath) return;

		history.pushState({ category: categoryName, source }, '', targetPath);

		const loaderFn = taskLoaders[source];
		if (loaderFn) loaderFn(categoryName);
	});

	window.onpopstate = function (event) {
		const state = event.state || {};
		const categoryName = state.category || null;
		const source = state.source || 'categoria';

		const loaderFn = taskLoaders[source];
		if (loaderFn) loaderFn(categoryName);
	};

	if (location.pathname === '/pages/home.html') {
		checkAndNotifyUpcomingTasks();

		const defaultPath = '/categorias/caixa-de-entrada';
		const defaultCategory = 'Caixa de Entrada';

		history.pushState({ category: defaultCategory, source: 'categoria' }, '', defaultPath);
		loadInboxTasks(defaultCategory);
	} else {
		const category = getCurrentCategoryFromURL() || 'Caixa de Entrada';
		let source = null;
		
		if (location.pathname.includes('moodle')) {
			source = 'moodle';
		} else if (location.pathname.includes('concluidas')) {
			source = 'concluidas';
		} else if (location.pathname.includes('pendentes')) {
		    source = 'pendentes';
		} else if (location.pathname.includes('projetos')) {
			source = 'projetos';
		} else if (location.pathname.includes('calendario')){
			source = 'calendario';
		} else if (location.pathname.includes('relatorio')){
			source = 'relatorio'
		} else {
			source = 'categoria';
		}

		const loaderFn = taskLoaders[source];
		if (loaderFn) loaderFn(category);
	}
}


export function loadAllTasksForSidebarCount() {

	  
  $.ajax({
    url: '/api/tasks?size=1000',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
		console.log('Tarefas carregadas:', response);
      const tasks = response.content || [];
      updateTaskCountsByCategory(tasks); 
    },
    error: function() {
      console.error('Erro ao carregar tarefas para contagem');
    }
  });
}

function updateTaskCountsByCategory(tasks) {
	const counts = {};

	tasks.forEach(task => {
		if (!task.done && task.category.name) {
			const cat = task.category.name;
			counts[cat] = (counts[cat] || 0) + 1;
		}
	});

	$('.task-count').each(function() {
		const category = $(this).data('category');
		const newCount = counts[category] || 0;
		const currentCount = parseInt($(this).text(), 10);

		if (newCount === 0) {
			$(this).hide();
		} else {
			if (currentCount !== newCount) {
				$(this).text(newCount);
			}
			$(this).show();
		}
	});
}



