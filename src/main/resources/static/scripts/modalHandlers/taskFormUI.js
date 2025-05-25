
import { loadSelectOptions } from '../api/estimatedTimes.js'; 
import { fetchProjects } from '../api/projectApi.js';

export function getTaskFormValues() {
    const rawDeadline = $('#deadlinemodal').val().trim();

    return {
        id: $('#taskModal').data('id'),
        description: $('#descriptionmodal').val(),
        priority: $('#formSwitch1').prop('checked'),
        deadline: rawDeadline,
        estimatedTimeId: $('#estimated_time').val(),
        subject: $('#subjectmodal').val(),
        delegated: $('#formSwitch2').prop('checked'),
        contextIds: $('#contexts').val(),
        categoryId: $('#categorymodal').val(),
        projectId: $('#getprojects').val()
    };
}

export function resetForm() {
    $('#taskForm')[0].reset();
    $('#categorymodal').val('').trigger('change');
    $('#subjectmodal').val('');
    $('#contexts').empty().trigger('change');
}

export function toggleCompletedState(isCompleted) {
    $('#taskForm input, #taskForm select, #taskForm textarea, #taskForm .unlinkProjectBtn').prop('disabled', isCompleted);
    $('#completedWarning').toggleClass('d-none', !isCompleted);
    $('#reopenTaskBtn').toggleClass('d-none', !isCompleted);
    $('#saveChangesBtn').toggleClass('d-none', isCompleted);
}

export function setTaskModalData(task) {
    $('#descriptionmodal').val(task.description);
    $('#formSwitch1').prop('checked', task.priority);
    $('#formSwitch2').prop('checked', task.delegated);
    $('#deadlinemodal').val(task.deadline);
    $('#subjectmodal').val(task.subject);
	if (task.estimatedTime) {
	    loadSelectOptions(task.estimatedTime.id);
	} else {
	    loadSelectOptions();
	}
	if (task.project) {
	    loadProjectOptions(task.project.id);
	} else {
	    loadProjectOptions();
	}
	
    $('#categorymodal').val(task.category?.id).trigger('change');

    if (task.contexts) {
        const newOptions = task.contexts.map(c =>
            new Option(c.text, c.id, true, true)
        );
        $('#contexts').append(newOptions).trigger('change');
    }

    updateSwitchLabel($('#formSwitch1'), $('#switchLabel1'));
    updateSwitchLabel($('#formSwitch2'), $('#switchLabel2'));
}

export function updateSwitchLabel(switchEl, labelEl) {
    labelEl.text(switchEl.is(':checked') ? 'Sim' : 'Não');
}

export function toggleProjectNavigationButtons() {
    const fromProject = $('body').attr('data-from-project') === 'true';

    if (fromProject) {
        $('#backToProjectBtn').removeClass('d-none');
        $('#closeTaskModalBtn').addClass('d-none');
    } else {
        $('#backToProjectBtn').addClass('d-none');
        $('#closeTaskModalBtn').removeClass('d-none');
    }
}

export function loadProjectOptions(selectedId = null) {
	fetchProjects()
		.done(activeProjects => {
			const $select = $('#getprojects');
			$select.empty();
			$select.append(`<option value="" ${selectedId === null ? 'selected' : ''}>Sem projeto associado</option>`);

			activeProjects.content.forEach(project => {
				const selectedAttr = project.id === selectedId ? 'selected' : '';
				$select.append(`<option value="${project.id}" ${selectedAttr}>${project.description}</option>`);
			});
		})
		.fail(() => alert("Erro ao carregar projetos."));
}

