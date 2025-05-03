import { getCurrentCategoryFromURL } from '/scripts/helpers.js';

export function setupSidebarNavigation(loadTasksCallback) {
	$('.clickable-icon').on('click', function(e) {
		e.preventDefault();

		const targetPath = $(this).data('href');
		const categoryName = $(this).data('categoria');

		if (!targetPath) return;

		history.pushState({ category: categoryName }, '', targetPath);

		loadTasksCallback(categoryName);
	});

	window.onpopstate = function(event) {
		const categoryName = event.state?.category || null;
		loadTasksCallback(categoryName);
	};

	if (location.pathname === '/pages/dashboard.html') {
		const defaultPath = '/categorias/caixa-de-entrada';
		const defaultCategory = 'Caixa de Entrada';

		history.pushState({ category: defaultCategory }, '', defaultPath);
		loadTasksCallback(defaultCategory);
	} else {
		const category = getCurrentCategoryFromURL();
		loadTasksCallback(category);
	}
}


export function loadAllTasksForSidebarCount() {
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
		const count = counts[category];

		if (count > 0) {
			$(this).text(`${count}`).show();
		} else {
			$(this).hide();
		}
	});
}


