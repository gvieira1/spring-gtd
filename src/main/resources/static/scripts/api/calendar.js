
import { openEditModal } from './task.js';


export function loadCalendarApi() {

	$('#categoryTitle').empty();
	$('#taskList').html(` 
		<h2 class="fw-bold mb-4"><i class="bi bi-calendar-check-fill"></i> Calendário</h2>
		<div id="calendarContainer">
			<div class="d-flex justify-content-between mb-1">
				<label class="fw-semibold bg-light p-2 rounded"> <span id="currentMonth"></span> </label>
			<div>
			<button id="prevMonth" class="btn btn-light btn-modal-bg">Anterior</button>
			<button id="nextMonth" class="btn btn-light btn-modal-bg">Próximo</button>
		</div>
		</div>
			<div id="calendar"></div>
		</div>								
		`);	
	
	const calendar = new tui.Calendar('#calendar', {
		usageStatistics: false,
		language: 'pt',
		defaultView: 'month',
		taskView: false,
		scheduleView: ['allday'],
		useDetailPopup: false,
		useCreationPopup: false,		    
		month: {
		    startDayOfWeek: 0,
		    dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
		  },
		template: {
			allday: function(schedule) {
			   return schedule?.title || '';
			 },
			 time: function(schedule) {
			   return schedule?.title || '';
			 },
			monthDayname: function(dayname) {
			      const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
			      return `<span class="calendar-dayname">${nomes[dayname.day]}</span>`;
			    }
		}
	});
	
	calendar.setTheme({
	  common: {
	    holiday: {
	      color: '6667ab',
	    },
	  week: {
		   gridSelection: {
		     color: 'rgb(156, 154, 227)',
		   },
		 },
	  },
	  
	});
	
	$('#prevMonth').on('click', () => {
	  calendar.prev();
	  updateCurrentMonth();
	});

	$('#nextMonth').on('click', () => {
	  calendar.next();
	  updateCurrentMonth();
	});
	
	function updateCurrentMonth() {
		if (!calendar) return; 
		  const currentDate = calendar.getDate(); 
		  const mes = currentDate.getMonth() + 1;
		  const ano = currentDate.getFullYear();
		  $('#currentMonth').text(`${mes.toString().padStart(2, '0')}/${ano}`);
		}

	updateCurrentMonth();	

	$.ajax({
		url: '/api/calendar',
		method: 'GET',
		dataType: 'json',
		
		success: function(data) {
		  console.log("Dados recebidos:", data);
		  
		  const calendarEvents = data.map(evento => ({
		    ...evento,
		    backgroundColor: '#9c9ae3',
		    borderColor: '#6667ab',
			color: '#fff'
		  }));
		  calendar.createEvents(calendarEvents);
		  
		  
		  calendar.on('clickEvent', function (event) {
		  		
			const eventId = event.event.id;
			const $modal = $('#taskModal');

			$modal.data('id', eventId);
			console.log("ID do evento no modal:", $modal.data('id'));
		  			openEditModal(eventId);
					
					const taskDesc = event.event.title;
					$('#taskModalLabel').text(taskDesc);

		  			const modal = new bootstrap.Modal(document.getElementById('taskModal'));
		  			modal.show();
					
					calendar.clear(); 
					calendar.createEvents(calendarEvents);
		  				
		  				  });

		},
		error: function(error) {
			console.error("Erro ao carregar eventos:", error);
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar calendário.</div>');
		}
	});
		
}


