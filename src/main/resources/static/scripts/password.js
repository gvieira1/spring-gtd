
$(document).ready(function () {
	initializeTokenFromURL();
	bindPasswordFormEvents();
});

function initializeTokenFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');
	$("#token").val(token);
}

function bindPasswordFormEvents() {
	$('#savePasswordBtn').on('click', validatePasswordMatch);
	$('#resetPasswordForm').on('submit', handlePasswordReset);
}

function validatePasswordMatch(e) {
	const password = $('#newPassword').val();
	const confirmPassword = $('#newPasswordConfirm').val();

	if (password !== confirmPassword) {
		e.preventDefault();
		showMessage('danger', 'Use a mesma senha nos dois campos');
	}
}

function handlePasswordReset(e) {
	e.preventDefault();
	const token = $('#token').val();
	const newPassword = $('#newPassword').val();

	$.ajax({
		type: "POST",
		url: "/api/password/reset",
		contentType: "application/json",
		data: JSON.stringify({ token, newPassword }),
		success: function () {
			window.location.href = "/";
		},
		error: function () {
			showMessage('danger', 'Token inválido fornecido');
		}
	});
}

function showMessage(type, text) {
	$('#error-message').html(`<div class="alert alert-${type} text-dark">${text}</div>`);
}
