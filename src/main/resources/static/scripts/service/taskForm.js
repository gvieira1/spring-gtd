import { handleFormSubmit } from './taskFormService.js';
import { resetForm, toggleCompletedState, setTaskModalData,  toggleProjectNavigationButtons } from '../modalHandlers/taskFormUI.js';
import { reopenTask } from '../api/taskApi.js';
import { formatDateFromIso } from '../helpers.js';

export function initUpdateForm() {
    $('#taskModal').on('show.bs.modal', function(event) {
        const triggerElement = $(event.relatedTarget);
        const taskId = triggerElement.data('id');
        $(this).data('id', taskId);
		
		$('#categorymodal').on('mousedown  keydown focus', function(e){
		    e.preventDefault();
			this.blur(); 
		});

    });

    $('#taskForm').submit(handleFormSubmit);
}

export function onReopenTask() {
    $('#reopenTaskBtn').on('click', function () {
        const taskId = $('#taskModal').data('id');
        toggleCompletedState(false);
        reopenTask(taskId);
    });
}

export function openEditModal(taskId) {
    resetForm();
	toggleProjectNavigationButtons();

    $.get(`/api/tasks/${taskId}`, function(task) {
        autocompleteSubjects();
        task.deadline = task.deadline ? formatDateFromIso(task.deadline) : '';
        setTaskModalData(task);
        toggleCompletedState(task.done);
        $('#taskId').data('id', task.id);
		
    }).fail(function () {
        alert('Erro ao carregar os dados da tarefa.');
    });
}

function autocompleteSubjects() {
    $.ajax({
        url: '/api/tasks/subjects',
        method: 'GET',
        success: function(data) {
            $("#subjectmodal").autocomplete({ source: data, minLength: 0 });
        }
    });

    $("#subjectmodal").on("focus", function () {
        $(this).autocomplete("search", "");
    });
}
