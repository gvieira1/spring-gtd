import { initializeSwitches } from './modal.js';
import { initDeleteModalHandlers, initDoneModalForm, initTaskOrProjectModal, removeProjectFromTaskForm } from './modalHandlers/taskModals.js';
import { initProjectModal, initDeleteProjectModalHandlers } from './modalHandlers/projectModals.js';
import { handleButtonState, createCalendar, runPageTransition } from './helpers.js';
import { setupSidebarNavigation, loadAllTasksForSidebarCount } from './api/sidebar.js'; 
import { initNotificationSettings } from './api/notifications.js';
import { backgroundMoodleSync } from './moodleTasks.js';
import { configureContextSelect2 } from './api/context.js';
import { loadTasksByContext } from './taskContextFilter.js';
import { initUpdateForm, onReopenTask } from './service/taskForm.js';

function initModals() {
  initProjectModal();
  initDeleteModalHandlers();
  initDoneModalForm();
  initTaskOrProjectModal();
  initDeleteProjectModalHandlers();
  removeProjectFromTaskForm();
}

function initFilters() {
  configureContextSelect2('#contexts', '#taskModal');
  configureContextSelect2('#navsearch', null, ' Filtre por contexto');
  loadTasksByContext();
}

function initUI() {
  initializeSwitches();
  handleButtonState('#newAction', '#addBtn');
  handleButtonState('#newTask', '#addTaskBtn');
  createCalendar();
  initUpdateForm();
  onReopenTask();
}

function initSidebarAndNotifications() {
  setupSidebarNavigation();
  loadAllTasksForSidebarCount();
  initNotificationSettings();
}

$(document).ready(function() {
  runPageTransition();

  initSidebarAndNotifications();

  backgroundMoodleSync();
  setInterval(backgroundMoodleSync, 900000);

  initFilters();
  initModals();
  initUI();
});

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    xhr._requestURL = settings.url;
  },
  complete: function(xhr) {
    const ignoredPaths = ['/api/moodle/sync'];
    const requestURL = xhr._requestURL;
    console.log("AJAX Complete → status:", xhr.status, "URL:", requestURL);
    if (xhr.status === 401 && requestURL && !ignoredPaths.some(path => requestURL.includes(path))) {
      console.log("Redirecionando para login...");
      window.location.href = "/";
    }
  }
});

