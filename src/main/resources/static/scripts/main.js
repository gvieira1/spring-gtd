
import { initializeSwitches } from './modal.js';
import { loadInboxTasks } from './api/task.js';
import { initDeleteModalHandlers, initDoneModalForm, initUpdateForm, initTaskOrProjectModal} from './taskForm.js';
import {  handleButtonState } from './helpers.js';
import { setupSidebarNavigation, loadAllTasksForSidebarCount } from './api/sidebar.js'; 


$(document).ready(function() {
	setupSidebarNavigation(loadInboxTasks);
	loadAllTasksForSidebarCount();
	initializeSwitches();
	initDeleteModalHandlers();
	initDoneModalForm();
	initUpdateForm();
	initTaskOrProjectModal();
	handleButtonState();
	
});
