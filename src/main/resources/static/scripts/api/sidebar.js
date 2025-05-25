import { getCurrentCategoryFromURL } from '/scripts/helpers.js';
import { checkAndNotifyUpcomingTasks } from './notifications.js';
import { loadInboxTasks, loadDoneTasks, fetchPendingTasks} from '../taskList.js'; 
import { loadMoodleTasks } from '../moodleTasks.js';
import { fetchActiveProjects } from '../service/projectRenderer.js';
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

function getSourceFromPath(pathname) {
	if (pathname.includes('moodle')) return 'moodle';
	if (pathname.includes('concluidas')) return 'concluidas';
	if (pathname.includes('pendentes')) return 'pendentes';
	if (pathname.includes('projetos')) return 'projetos';
	if (pathname.includes('calendario')) return 'calendario';
	if (pathname.includes('relatorio')) return 'relatorio';
	return 'categoria';
}

function loadTasksBySource(source, category) {
	const loaderFn = taskLoaders[source];
	if (loaderFn) loaderFn(category);
}

export function setupSidebarNavigation() {
	$('.history-btn').on('click', function (e) {
		e.preventDefault();

		const targetPath = $(this).data('href');
		const categoryName = $(this).data('categoria') || null;
		const source = $(this).data('source') || 'categoria';

		if (!targetPath) return;

		history.pushState({ category: categoryName, source }, '', targetPath);
		loadTasksBySource(source, categoryName);
	});

	window.onpopstate = function (event) {
		const { category = null, source = 'categoria' } = event.state || {};
		loadTasksBySource(source, category);
	};

	if (location.pathname === '/pages/home.html') {
		checkAndNotifyUpcomingTasks();

		const defaultCategory = 'Caixa de Entrada';
		const defaultPath = '/categorias/caixa-de-entrada';

		history.pushState({ category: defaultCategory, source: 'categoria' }, '', defaultPath);
		loadInboxTasks(defaultCategory);
	} else {
		const category = getCurrentCategoryFromURL() || 'Caixa de Entrada';
		const source = getSourceFromPath(location.pathname);
		loadTasksBySource(source, category);
	}
}



function countTasksByCategory(tasks) {
	return tasks.reduce((acc, task) => {
		if (!task.done && task.category?.name) {
			acc[task.category.name] = (acc[task.category.name] || 0) + 1;
		}
		return acc;
	}, {});
}

function updateSidebarTaskCountUI(counts) {
	$('.task-count').each(function () {
		const category = $(this).data('category');
		const newCount = counts[category] || 0;

		if (newCount === 0) {
			$(this).hide();
		} else {
			$(this).text(newCount).show();
		}
	});
}


export function loadAllTasksForSidebarCount() {
	$.ajax({
		url: '/api/tasks?size=1000',
		method: 'GET',
		dataType: 'json',
		success: function (response) {
			console.log('Tarefas carregadas:', response);
			const tasks = response.content || [];
			const counts = countTasksByCategory(tasks);
			updateSidebarTaskCountUI(counts);
		},
		error: function () {
			console.error('Erro ao carregar tarefas para contagem');
		}
	});
}
