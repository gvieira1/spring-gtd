
import { renderTasks } from './service/taskRenderer.js';
import { fetchTasksFromMoodle, checkMoodleSyncStatus, syncWithMoodle } from './api/moodleApi.js';

export function loadMoodleTasks() {
	$('#categoryTitle').text('Moodle');

	checkMoodleSyncStatus()
		.done(function (isSynced) {
			if (!isSynced) {
				$('#taskList').html(`
					<div class="alert alert-light d-flex justify-content-between align-items-center">
						<span class="fs-6 fw-medium">Deseja sincronizar com o Moodle usando seu e-mail cadastrado?</span>
						<button class="btn btn-outline-secondary btn-modal-bg" id="syncMoodleBtn">
							<i class="bi bi-arrow-repeat fs-5"></i> Sincronizar
						</button>
					</div>
				`);

				$('#syncMoodleBtn').on('click', function () {
					syncWithMoodle()
						.done(function (msg) {
							console.log('Sincronização com Moodle feita com sucesso:', msg);
							loadMoodleTasks();
						})
						.fail(function (xhr) {
							const response = xhr.responseJSON;
							console.error('Erro ao sincronizar com Moodle:', response?.error || xhr.statusText);
							let message = 'Erro ao verificar sincronização com o Moodle.';

							if (xhr.status === 401 && response?.error?.includes('não encontrado')) {
								message = 'Não encontramos seu usuário no Moodle com o e-mail cadastrado. Verifique ou entre em contato com o suporte.';
							}

							$('#taskList').html(`<div class="alert alert-danger">${message}</div>`);
						});
				});
			} else {
				if (window.cachedMoodleTasks) {
					renderTasks({ tasks: window.cachedMoodleTasks, showDone: false, showToggle: true });
				} else {
					fetchTasksFromMoodle()
						.then(function (response) {
							window.cachedMoodleTasks = response.content;
							renderTasks({ tasks: response.content, showDone: false, showToggle: true });
						})
						.catch(function () {
							$('#taskList').html('<div class="alert alert-danger">Erro ao carregar tarefas do Moodle. Serviço externo está indisponível.</div>');
						});
				}
			}
		})
		.fail(function () {
			$('#taskList').html('<div class="alert alert-danger">Erro ao verificar sincronização com o Moodle.</div>');
		});
}

function updateCachedMoodleTasks() {
	fetchTasksFromMoodle()
		.then(function (response) {
			window.cachedMoodleTasks = response.content;
			console.log('Tarefas Moodle atualizadas em background');
		})
		.catch(function () {
			console.warn('Erro ao buscar tarefas do Moodle em background');
		});
}

export function backgroundMoodleSync() {
	checkMoodleSyncStatus()
		.done(function (isSynced) {
			if (!isSynced) {
				syncWithMoodle()
					.done(function (msg) {
						console.log('Sincronização automática com Moodle feita com sucesso:', msg);
						updateCachedMoodleTasks();
					})
					.fail(function (xhr) {
						console.warn('Erro ao sincronizar automaticamente com o Moodle:', xhr.responseJSON || xhr.statusText);
					});
			} else {
				updateCachedMoodleTasks();
			}
		});
}
