
import { initializeSwitches } from './modal.js';
import { initDeleteModalHandlers, initDoneModalForm, initUpdateForm, initTaskOrProjectModal, onReopenTask, removeProjectFromTaskForm } from './taskForm.js';
import { initProjectModal, initDeleteProjectModalHandlers } from './projectForm.js';
import {  handleButtonState, createCalendar, runPageTransition} from './helpers.js';
import { setupSidebarNavigation, loadAllTasksForSidebarCount } from './api/sidebar.js'; 
import {  initNotificationSettings } from './api/notifications.js';
import { loadMoodleTasks, loadTasksByContext } from './api/task.js';
import { configureContextSelect2 } from './api/context.js';


$(document).ready(function() {
	runPageTransition();
	setupSidebarNavigation();
	setInterval(loadMoodleTasks, 900000);
	initializeSwitches();
	configureContextSelect2('#contexts', '#taskModal');
	configureContextSelect2('#navsearch', null, ' Filtre por contexto'); 
	loadTasksByContext();
	initProjectModal();
	initDeleteModalHandlers();
	initDoneModalForm();
	initUpdateForm();
	createCalendar();
	initTaskOrProjectModal();
	handleButtonState('#newAction', '#addBtn');
	handleButtonState('#newTask', '#addTaskBtn');
	removeProjectFromTaskForm();
	initNotificationSettings();
	initDeleteProjectModalHandlers();
	loadAllTasksForSidebarCount();
	onReopenTask();
});


$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        xhr._requestURL = settings.url;
    },
    complete: function(xhr) {
        const ignoredPaths = ['/api/moodle/sync'];
        const requestURL = xhr._requestURL; 
        console.log("AJAX Complete → status:", xhr.status, "URL:", requestURL);
        if (xhr.status === 401 && requestURL && !ignoredPaths.some(path => requestURL.includes(path))){
            console.log("Redirecionando para login...");
            window.location.href = "/";
        }
    }
});


