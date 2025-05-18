
import { deleteTask, updateDone, updateTask, createTask, reopenTask, removeProjectFromTask } from './api/task.js';
import { createProject } from './api/project.js';
import { formatDateToIso } from './helpers.js';

export function initDeleteModalHandlers() {
	$('#deleteTaskBtn').on('click', function () {
		const taskId = $('#taskId').data('id');
		const taskDesc = $('#descriptionmodal').val();

		$('#deleteModal').data('delete-type', 'task').data('id', taskId);
		$('#taskToDeleteDesc').text(`"${taskDesc}"`);
	});

	$('#confirmDelete').on('click', function() {
		const taskId = $('#deleteModal').data('id');
		const type = $('#deleteModal').data('delete-type');

		if (taskId && type === 'task') {
			deleteTask(taskId);
		}

		$('#deleteModal').modal('hide');
	});
}

export function initDoneModalForm() {
	$('#doneModal').on('show.bs.modal', function(event) {
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
					`Finalizar a <strong>última tarefa</strong> do projeto?<br><br><small class="text-muted">Isso também marcará o projeto como concluído.</small><br>`
				);
			} else {
				$('#doneModalLabel').text('Finalizar tarefa?');
			}
		} else {
			$('#doneModalLabel').text('Finalizar tarefa?');
		}
	});

	$('#doneModalForm').submit(function(e) {
		e.preventDefault();
		const taskId = $('#doneModal').data('id');
		if (taskId) {
			updateDone(taskId);
		}
		$('#doneModal').modal('hide');
	});
}



export function initUpdateForm(){
	
	$('#taskModal').on('show.bs.modal', function(event) {
			const triggerElement = $(event.relatedTarget);
			const taskId = triggerElement.data('id');
			$(this).data('id', taskId);
			
			const originalCategory = $('#categorymodal').val();
			$(this).data('originalCategory', originalCategory);
		});
		
	$('#taskForm').submit(function(e) {
	    e.preventDefault();

	    const taskId = $('#taskModal').data('id');
		
		const deadlineCheck = validateDeadline('deadlinemodal', 'deadlineError');
		    if (!deadlineCheck.valid) {
		        e.preventDefault();
		        return;
		    }
		 
	    const updatedTask = {
	        id: taskId,
	        description: $('#descriptionmodal').val(),
	        priority: $('#formSwitch1').prop('checked'),
	        deadline: deadlineCheck.value,
	        estimatedTimeId: $('#estimated_time').val(),
	        subject: $('#subjectmodal').val(),
	        delegated: $('#formSwitch2').prop('checked'),
			contextIds: $('#contexts').val(),
	        categoryId: $('#categorymodal').val(),
			projectId: $('#getprojects').val()
	    };

	    updateTask(taskId, updatedTask);
	});
}

function validateDeadline(inputId, errorId) {
    const rawValue = $(`#${inputId}`).val().trim();

    $(`#${inputId}`).removeClass('is-invalid');
    $(`#${errorId}`).addClass('d-none');

    if (rawValue === "") {
        return { valid: true, value: null };
    }

    const [day, month, year] = rawValue.split('/');
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(deadlineDate) || deadlineDate < today) {
        $(`#${inputId}`).addClass('is-invalid');
        $(`#${errorId}`).removeClass('d-none');
        return { valid: false };
    }
    return { valid: true, value: formatDateToIso(rawValue) };
}


export function initTaskOrProjectModal() {
    $('#taskOrProjectModal').on('show.bs.modal', function () {
        const actionText = $('#newAction').val();
        if (!actionText) {
            return false;
        }
        $(this).data('action-text', actionText);
    });

    $('#convertToProject').on('click', function () {
        const text = $('#taskOrProjectModal').data('action-text');
		if (text) {
			createProject(text);
		}
        
    });

    $('#submitAsTask').on('click', function () {
        const text = $('#taskOrProjectModal').data('action-text');
		if (text) {
			createTask(text);
		}
	});
	
	$('#taskOrProjectModal').on('hidden.bs.modal', function () {
	    $('#newAction').val('');
	});

}

export function onReopenTask(){
	
	$('#reopenTaskBtn').on('click', function () {
	  const taskId = $('#taskModal').data('id');
	  
	  $('#taskForm input, #taskForm select, #taskForm textarea').prop('disabled', false);
	  $('#completedWarning').addClass('d-none');
	  $(this).addClass('d-none');
	  $('#saveChangesBtn').removeClass('d-none'); 
	  $('input[type="checkbox"][data-bs-toggle="modal"]').prop('checked', false);
	  
	  reopenTask(taskId);
	});
}

export function removeProjectFromTaskForm(){
	$('#unlinkProjectBtn').on('click', function () {
		const taskId = $('#taskModal').data('id');
		removeProjectFromTask(taskId);
	});
}

