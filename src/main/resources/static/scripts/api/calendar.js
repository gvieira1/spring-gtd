import { openEditModal } from '../service/taskForm.js';

export function loadCalendarApi() {
	clearPreviousContent();

	const calendar = initializeCalendar();
	configureCalendarTheme(calendar);
	configureNavigation(calendar);
	updateCurrentMonthDisplay(calendar);
	loadCalendarEvents(calendar);
}

function clearPreviousContent() {
	$('#categoryTitle').empty();
	$('#taskList').html(getCalendarHtml());
}

function getCalendarHtml() {
	return `
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
	`;
}

function initializeCalendar() {
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
			allday: schedule => schedule?.title || '',
			time: schedule => schedule?.title || '',
			monthDayname: dayname => `<span class="calendar-dayname">${getDayName(dayname.day)}</span>`
		}
	});
	return calendar;
}

function getDayName(index) {
	const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
	return nomes[index] || '';
}

function configureCalendarTheme(calendar) {
	calendar.setTheme({
		common: {
			holiday: { color: '6667ab' }
		},
		week: {
			gridSelection: { color: 'rgb(156, 154, 227)' }
		}
	});
}

function configureNavigation(calendar) {
	$('#prevMonth').on('click', () => {
		calendar.prev();
		updateCurrentMonthDisplay(calendar);
	});

	$('#nextMonth').on('click', () => {
		calendar.next();
		updateCurrentMonthDisplay(calendar);
	});
}

function updateCurrentMonthDisplay(calendar) {
	const currentDate = calendar.getDate();
	const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
	const ano = currentDate.getFullYear();
	$('#currentMonth').text(`${mes}/${ano}`);
}

function loadCalendarEvents(calendar) {
	$.ajax({
		url: '/api/calendar',
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			const calendarEvents = prepareCalendarEvents(data);
			calendar.createEvents(calendarEvents);
			setupEventClickHandler(calendar, calendarEvents);
		},
		error: function() {
			$('#taskList').html('<div class="alert alert-danger">Erro ao carregar calendário.</div>');
		}
	});
}

function prepareCalendarEvents(events) {
	return events.map(event => ({
		...event,
		backgroundColor: '#9c9ae3',
		borderColor: '#6667ab',
		color: '#fff'
	}));
}

function setupEventClickHandler(calendar, events) {
	calendar.on('clickEvent', function (event) {
		const taskId = event.event.id;
		const taskDesc = event.event.title;

		$('#taskModal')
			.data('id', taskId)
			.find('#taskModalLabel').text(taskDesc);

		openEditModal(taskId);

		const modal = new bootstrap.Modal(document.getElementById('taskModal'));
		modal.show();

		calendar.clear();
		calendar.createEvents(events);
	});
}
