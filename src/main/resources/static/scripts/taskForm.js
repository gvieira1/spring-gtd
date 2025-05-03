


import { deleteTask, updateDone, updateTask, createTask } from './api/task.js';
import { createProject } from './api/project.js';

export function initDeleteModalHandlers() {
	$('#deleteTaskBtn').on('click', function() {
		const taskId = $('#taskId').data('id');
		const taskDesc = $('#descriptionmodal').val();

		$('#deleteModal').data('task-id', taskId);
		$('#taskToDeleteDesc').text(`"${taskDesc}"`);
	});

	$('#confirmDelete').on('click', function() {
		const taskId = $('#deleteModal').data('task-id');
		console.log(taskId);

		if (taskId) {
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
		let deadlineValue = $('#deadlinemodal').val();
		deadlineValue = deadlineValue === "" ? null : deadlineValue;
		 
	    const updatedTask = {
	        id: taskId,
	        description: $('#descriptionmodal').val(),
	        priority: $('#formSwitch1').prop('checked'),
	        deadline: deadlineValue,
	        estimatedTimeId: $('#estimated_time').val(),
	        subject: $('#subjectmodal').val(),
	        delegated: $('#formSwitch2').prop('checked'),
	        categoryId: $('#categorymodal').val()	
	    };

		console.log("Dados enviados para o update:", updatedTask);
	    updateTask(taskId, updatedTask);
	});
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

