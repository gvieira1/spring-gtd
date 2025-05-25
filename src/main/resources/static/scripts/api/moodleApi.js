
export function checkMoodleSyncStatus() {
	return $.get('/api/moodle/check-moodle-sync');
}

export function syncWithMoodle() {
	return $.post('/api/moodle/sync');
}

export function fetchTasksFromMoodle() {
	return $.ajax({
		url: '/api/moodle/sync-tasks',
		method: 'GET',
		dataType: 'json'
	});
}
