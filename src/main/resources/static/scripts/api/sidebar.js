import { getCurrentCategoryFromURL } from '/scripts/helpers.js';
import { checkAndNotifyUpcomingTasks } from './notifications.js';
import { loadMoodleTasks, loadInboxTasks } from './task.js';

const taskLoaders = {
	'categoria': loadInboxTasks,
	'moodle': loadMoodleTasks
};

export function setupSidebarNavigation() {
	$('.clickable-icon').on('click', function (e) {
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

	if (location.pathname === '/pages/dashboard.html') {
		checkAndNotifyUpcomingTasks();

		const defaultPath = '/categorias/caixa-de-entrada';
		const defaultCategory = 'Caixa de Entrada';

		history.pushState({ category: defaultCategory, source: 'categoria' }, '', defaultPath);
		loadInboxTasks(defaultCategory);
	} else {
		const category = getCurrentCategoryFromURL() || 'Caixa de Entrada';
		const source = location.pathname.includes('moodle') ? 'moodle' : 'categoria';

		const loaderFn = taskLoaders[source];
		if (loaderFn) loaderFn(category);
	}
}

let cachedTasks = null;

export function loadAllTasksForSidebarCount() {
	
	if (cachedTasks) {
	    updateTaskCountsByCategory(cachedTasks);
	  }
	  
  $.ajax({
    url: '/api/tasks',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
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
		if (!task.done && task.category?.name) {
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



