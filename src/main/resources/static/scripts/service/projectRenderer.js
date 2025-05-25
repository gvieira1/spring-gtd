import { fetchProjects } from '../api/projectApi.js';
import { openProjectModal, backToProjectModal } from '../modalHandlers/projectModals.js';

export function fetchActiveProjects() {
	fetchProjects()
		.done(response => {
			updateCategoryTitle("Projetos");
			renderActiveProjects(response.content);
		})
		.fail(showFetchError);
}

export function renderActiveProjects(projects, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	prepareProjectList($container, projects);
	renderProjectList(projects, $container);
	backToProjectModal();
}

function prepareProjectList($container, projects) {
	$container.empty();
	renderToggleSwitch($container, projects);
}

function renderToggleSwitch($container, projects) {
	const toggleHtml = `
		<div class="form-check form-switch mb-3">
			<input class="form-check-input" type="checkbox" id="showCompletedProjects">
			<label class="form-check-label" for="showCompletedProjects">Exibir projetos concluídos</label>
		</div>
	`;

	$container.append(toggleHtml);
	$container.on('change', '#showCompletedProjects', () => {
		renderProjectList(projects, $container);
	});
}

function renderProjectList(projects, $container) {
	$container.find('.project-data').remove();
	$('body').attr('data-from-project', 'true');

	const showCompleted = $('#showCompletedProjects').is(':checked');
	const visibleProjects = filterProjects(projects, showCompleted);

	if (visibleProjects.length === 0) {
		showNoProjectsMessage($container);
		return;
	}

	visibleProjects.forEach(project => {
		const $card = createProjectCard(project);
		$container.append($card);
	});
}

function createProjectCard(project) {
	const statusClass = project.done ? 'text-muted text-decoration-line-through' : '';

	const $card = $(`
		<div class="task-card d-flex justify-content-between align-items-center mb-2 project-data ${statusClass}" 
			data-bs-toggle="modal" data-bs-target="#projectModal" 
			data-id="${project.id}" 
			data-description="${project.description}">
			<div>${project.description}</div>
		</div>
	`);

	$card.on('click', function () {
		const projectId = $(this).data('id');
		const projectDesc = $(this).data('description');

		$('#projectModal').attr('data-project-id', projectId);
		openProjectModal(projectId);
		$('#projectModalLabel').text(projectDesc);
	});

	return $card;
}

function updateCategoryTitle(title) {
	$('#categoryTitle').text(title);
}

function showNoProjectsMessage($container) {
	$container.append('<div class="alert alert-light project-data">Sem projetos por enquanto. Aproveite!</div>');
}

function filterProjects(projects, includeDone) {
	return includeDone ? projects : projects.filter(p => !p.done);
}

function showFetchError() {
	$('#taskList').html('<div class="alert alert-danger">Erro ao carregar projetos.</div>');
}
