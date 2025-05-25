
let originalLoginForm = null;

$(document).ready(function () {
	if (!originalLoginForm) {
		originalLoginForm = $('#formContainer').html();
	}

	bindUIEvents();
});

function bindUIEvents() {
	$(document).on('click', '#forgotBtn', showForgotPasswordForm);
	$(document).on('click', '#signupBtn', showSignupForm);
	$(document).on('click', '#backButton', restoreOriginalForm);

	$(document).on('submit', '#forgotPasswordForm', handleForgotPasswordSubmit);
	$(document).on('submit', '#loginForm', handleLoginSubmit);
	$(document).on('click', '#btnSignup', validateSignupPasswords);
	$(document).on('submit', '#signupForm', handleSignupSubmit);
}

function showForgotPasswordForm(e) {
	e.preventDefault();
	const html = `
		<a id="backButton" class="text-decoration-none text-dark mb-4"><i class="bi bi-arrow-left fs-4"></i></a>
		<h3 class="text-center fw-bold mb-4 mt-4">Receba o link de recuperação</h3>
		<div id="error-message"></div>
		<form id="forgotPasswordForm">
			<div class="form-group">
				<i class="bi bi-envelope-fill"></i>
				<input type="email" id="email" class="form-control mt-6" placeholder="Seu email cadastrado" required autofocus>
			</div>
			<br>
			<div class="d-grid mb-4">
				<button type="submit" class="btn btn-custom btnadd">Enviar para o email</button>
			</div>
		</form>
	`;
	slideReplaceForm(html);
}

function showSignupForm(e) {
	e.preventDefault();
	const html = `
		<a id="backButton" class="text-decoration-none text-dark"><i class="bi bi-arrow-left fs-4"></i></a>
		<h3 class="text-center fw-bold">Crie sua conta</h3>
		<p class="text-center text-muted mb-4">com email e senha</p>
		<div id="error-message"></div>
		<form id="signupForm">
			<div class="form-group">
				<i class="bi bi-person-fill"></i>
				<input type="text" class="form-control" placeholder="Nome" id="name" required>
			</div>
			<div class="form-group">
				<i class="bi bi-envelope-fill"></i>
				<input type="email" class="form-control" placeholder="Email" id="emailsignup" required>
			</div>
			<div class="form-group">
				<i class="bi bi-lock-fill"></i>
				<input type="password" class="form-control" placeholder="Senha" id="passwordsignup1" required>
			</div>
			<div class="form-group">
				<i class="bi bi-lock-fill"></i>
				<input type="password" class="form-control" placeholder="Confirme a senha" id="passwordsignup2" required>
			</div>
			<div class="d-grid mt-4">
				<button type="submit" class="btn btn-custom" id="btnSignup">Cadastre-se</button>
			</div>
		</form>
	`;
	slideReplaceForm(html);
}

function restoreOriginalForm(e) {
	e.preventDefault();
	slideReplaceForm(originalLoginForm);
}

function slideReplaceForm(html) {
	$('#formContainer').slideUp(300, function () {
		$(this).html(html).slideDown(300);
	});
}

function handleForgotPasswordSubmit(e) {
	e.preventDefault();
	const email = $('#email').val();

	$.ajax({
		type: "POST",
		url: "/api/password/forgot",
		contentType: "application/json",
		data: JSON.stringify({ email }),
		success: function () {
			restoreOriginalForm(e);
			showMessage('success', 'Verifique seu email');
		},
		error: function () {
			showMessage('danger', 'Erro na requisição');
		}
	});
}

function handleLoginSubmit(e) {
	e.preventDefault();

	const email = $('#email').val();
	const password = $('#password').val();

	$.ajax({
		url: '/auth/login',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ email, password }),
		xhrFields: { withCredentials: true },
		success: function () {
			transitionToHome();
		},
		error: function () {
			showMessage('danger', 'Email ou senha incorretos. Tente novamente.');
		}
	});
}

function handleSignupSubmit(e) {
	e.preventDefault();

	const name = $('#name').val();
	const email = $('#emailsignup').val();
	const password = $('#passwordsignup1').val();

	$.ajax({
		url: '/auth/register',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ name, email, password }),
		success: function () {
			slideReplaceForm(originalLoginForm);
			showMessage('success', 'Conta criada! Inicie sua sessão');
		},
		error: function () {
			showMessage('danger', 'Erro no envio. Tente novamente mais tarde.');
		}
	});
}

function validateSignupPasswords(e) {
	const password = $('#passwordsignup1').val();
	const confirmPassword = $('#passwordsignup2').val();

	if (password !== confirmPassword) {
		e.preventDefault();
		showMessage('danger', 'Use a mesma senha nos dois campos');
	}
}

function showMessage(type, text) {
	$('#error-message').html(`<div class="alert alert-${type} text-dark">${text}</div>`);
}

function transitionToHome() {
	$('body').append('<div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #8179B3; z-index: 9999; opacity: 0.6; transition: opacity 0.6s ease;" id="out-transition"></div>');
	$('#out-transition').css('opacity', '1');
	setTimeout(() => {
		window.location.href = '/pages/home.html';
	}, 400);
}
