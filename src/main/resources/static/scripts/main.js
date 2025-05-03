
import { initializeSwitches } from './modal.js';
import { initDeleteModalHandlers, initDoneModalForm, initUpdateForm, initTaskOrProjectModal} from './taskForm.js';
import {  handleButtonState, createCalendar } from './helpers.js';
import { setupSidebarNavigation, loadAllTasksForSidebarCount } from './api/sidebar.js'; 
import {  initNotificationSettings } from './api/notifications.js';
import { loadMoodleTasks } from './api/task.js';


$(document).ready(function() {
	setupSidebarNavigation();
	setInterval(loadMoodleTasks, 900000);
	loadAllTasksForSidebarCount();
	initializeSwitches();
	initDeleteModalHandlers();
	initDoneModalForm();
	initUpdateForm();
	createCalendar();
	initTaskOrProjectModal();
	handleButtonState();
	initNotificationSettings();
});
