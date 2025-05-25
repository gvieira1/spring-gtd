import { formatDateFromIso } from '../helpers.js';
import { openEditModal } from './taskForm.js';

export function showCategoryToast(message = "Categoria alterada!") {
	const toastEl = document.getElementById('categoryToast');
	const toastBody = document.getElementById('categoryToastBody');

	toastBody.innerHTML = `<i class="bi bi-lightbulb me-2 fs-4"></i> ${message}`;

	const toast = new bootstrap.Toast(toastEl);
	toast.show();
}

export function renderTasks({ tasks, containerSelector = '#taskList', showDone = false, showToggle = true }) {
	const $container = $(containerSelector);
	$container.empty();

	const filteredTasks = filterTasks(tasks, showDone);

	if (filteredTasks.length === 0) {
		renderEmptyMessage($container, showDone);
		return;
	}

	filteredTasks.forEach(task => {
		const $taskCard = createTaskCard(task, showToggle);
		$container.append($taskCard);
	});

	if (showToggle) {
		resetCheckboxOnModalClose();
	}
}

function filterTasks(tasks, showDone) {
	if (typeof showDone !== 'boolean') return tasks;
	return tasks.filter(task => task.done === showDone);
}

function renderEmptyMessage($container, showDone) {
	const message = showDone
		? 'Sem tarefas concluídas nesta categoria. Tudo feito!'
		: 'Sem tarefas nesta categoria. Tudo tranquilo por aqui!';
	$container.html(`<div class="alert alert-light">${message}</div>`);
}

function createTaskCard(task, showToggle) {
	const isScheduled = task.category?.name === 'Agendado';
	const now = new Date();
	const deadlineDate = new Date(task.deadline);
	const isOverdue = isScheduled && deadlineDate < now;

	const statusClass = task.done ? 'text-muted text-decoration-line-through' : '';
	const projectBadge = task.project ? `<span class="badge bg-light text-dark fs-7">Projeto</span>` : '';

	const categoryBadge = isScheduled
		? `<span class="badge ${isOverdue ? 'bg-danger text-light' : 'bg-light text-dark'}">${formatDateFromIso(task.deadline)}</span>`
		: `<span class="badge bg-light text-dark">${task.category.name}</span>`;

	const checkbox = showToggle
		? `<input type="checkbox" class="form-check-input me-2" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#doneModal" ${task.done ? 'checked disabled' : ''}/>`
		: '';

	const contextBadges = task.contexts.map(ctx =>
		`<span class="badge bg-secondary me-1">${ctx.text}</span>`
	).join('');

	const $card = $(`
		<div class="task-card d-flex justify-content-between align-items-center mb-2 ${statusClass}" 
			data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${task.id}">
			<div>
				${checkbox}${task.description}
			</div>
			<div class="d-flex gap-1">
				${contextBadges}
				${projectBadge}
				${categoryBadge}
			</div>
		</div>
	`);

	$card.on('click', function () {
		const tarefaId = $(this).data('id');
		openEditModal(tarefaId);
		$('#taskModalLabel').text(task.description);
	});

	return $card;
}

function resetCheckboxOnModalClose() {
	$('#doneModal').on('hidden.bs.modal', function () {
		$('input[type="checkbox"][data-bs-toggle="modal"]').prop('checked', false);
	});
}
