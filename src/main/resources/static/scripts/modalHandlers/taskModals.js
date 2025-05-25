
import { deleteTask, createTask, updateDone, removeProjectFromTask } from '../api/taskApi.js';
import { createProject } from '../service/projectForm.js';

export function initDeleteModalHandlers() {
    $('#deleteTaskBtn').on('click', function () {
        const taskId = $('#taskId').data('id');
        const taskDesc = $('#descriptionmodal').val();

        $('#deleteModal')
            .data('delete-type', 'task')
            .data('id', taskId);

        $('#taskToDeleteDesc').text(`"${taskDesc}"`);
    });

    $('#confirmDelete').on('click', function () {
        const taskId = $('#deleteModal').data('id');
        const type = $('#deleteModal').data('delete-type');

        if (taskId && type === 'task') {
            deleteTask(taskId);
        }

        $('#deleteModal').modal('hide');
    });
}

export function initDoneModalForm() {
    $('#doneModal').on('show.bs.modal', function (event) {
        const triggerElement = $(event.relatedTarget);
        const taskId = triggerElement.data('id');
        $(this).data('id', taskId);

        const tasks = window.currentProjectTasks;
        const isProjectContext = Array.isArray(tasks);

        if (isProjectContext) {
            const pendingTasks = tasks.filter(t => String(t.done) !== 'true' && t.id !== taskId);
            const isLastPending = pendingTasks.length === 0;

            if (isLastPending) {
                $('#doneModalLabel').html(
                    `Finalizar a <strong>última tarefa</strong> do projeto?<br><br>
                    <small class="text-muted">Isso também marcará o projeto como concluído.</small><br>`
                );
            } else {
                $('#doneModalLabel').text('Finalizar tarefa?');
            }
        } else {
            $('#doneModalLabel').text('Finalizar tarefa?');
        }
    });

    $('#doneModalForm').submit(function (e) {
        e.preventDefault();
        const taskId = $('#doneModal').data('id');
        if (taskId) {
            updateDone(taskId);
        }
        $('#doneModal').modal('hide');
    });
}

export function initTaskOrProjectModal() {
    $('#taskOrProjectModal').on('show.bs.modal', function () {
        const actionText = $('#newAction').val();
        if (!actionText) { return false; }
        $(this).data('action-text', actionText);
    });

    $('#convertToProject').on('click', function () {
        const text = $('#taskOrProjectModal').data('action-text');
        if (text) { createProject(text);}
    });

    $('#submitAsTask').on('click', function () {
        const text = $('#taskOrProjectModal').data('action-text');
        if (text) { createTask(text); }
    });

    $('#taskOrProjectModal').on('hidden.bs.modal', function () {
        $('#newAction').val('');
    });
}

export function removeProjectFromTaskForm() {
    $('#unlinkProjectBtn').on('click', function () {
        const taskId = $('#taskModal').data('id');
        removeProjectFromTask(taskId);
    });
}
