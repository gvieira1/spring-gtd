import { renderTasks } from './service/taskRenderer.js';
import { setupSidebarNavigation } from './api/sidebar.js';

export function loadTasksByContext(){
	$('#navsearch').on('change', function () {
	  const selectedContexts = $(this).val(); 
	  if (!selectedContexts || selectedContexts.length === 0) {
	      setupSidebarNavigation();
	      return;
	    }
		$('#categoryTitle').html('<i class="bi bi-search me-2"></i>Por Contexto');

	  $.ajax({
	    url: '/api/tasks/by-contexts',
	    method: 'GET',
	    data: { contextIds: selectedContexts },
	    success: function (response) {
	      renderTasks({
				tasks: response,
				showDone: false,
				showToggle: true
			}); 
	    },
		error: function () {
			alert('Erro ao carregar contextos.');
		}
	  });
	});
	

}
