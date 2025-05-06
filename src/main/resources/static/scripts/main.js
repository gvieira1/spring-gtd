
import { initializeSwitches } from './modal.js';
import { initDeleteModalHandlers, initDoneModalForm, initUpdateForm, initTaskOrProjectModal} from './taskForm.js';
import { initProjectModal, initDeleteProjectModalHandlers } from './projectForm.js';
import {  handleButtonState, createCalendar} from './helpers.js';
import { setupSidebarNavigation, loadAllTasksForSidebarCount } from './api/sidebar.js'; 
import {  initNotificationSettings } from './api/notifications.js';
import { loadMoodleTasks} from './api/task.js';


$(document).ready(function() {
	setupSidebarNavigation();
	setInterval(loadMoodleTasks, 900000);

	initProjectModal();
	initializeSwitches();
	initDeleteModalHandlers();
	initDoneModalForm();
	initUpdateForm();
	createCalendar();
	initTaskOrProjectModal();
	handleButtonState('#newAction', '#addBtn');
	handleButtonState('#newTask', '#addTaskBtn');
	initNotificationSettings();
	initDeleteProjectModalHandlers();
	loadAllTasksForSidebarCount();
});
