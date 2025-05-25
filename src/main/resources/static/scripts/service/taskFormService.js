

import { updateTask } from '../api/taskApi.js';
import { getTaskFormValues } from '../modalHandlers/taskFormUI.js';
import { validateDeadline } from '../helpers.js';

export function handleFormSubmit(e) {
    e.preventDefault();
    const formData = getTaskFormValues();
    const deadlineCheck = validateDeadline(formData.deadline, 'deadlineError');

    if (!deadlineCheck.valid) return;

    const taskToUpdate = {
        ...formData,
        deadline: deadlineCheck.value
    };

    updateTask(formData.id, taskToUpdate);
}
