	
let originalLoginForm = null;

$(document).ready(function() {
	
	if (!originalLoginForm) {
	      originalLoginForm = $('#formContainer').html();
	 }

	$(document).on('click', '#forgotBtn', function(e) {
        e.preventDefault();
		
        const forgotFormHtml = `
		<div class="row justify-content-center ">
		      <div class="col-md-5 col-lg-4">
		        <div class="card shadow-sm border-0 p-4 rounded-4">
				<a id="backButton" class="position-absolute top-0 start-0 m-3 text-decoration-none text-dark backButton">
				      <i class="bi bi-arrow-left fs-4"></i>
				    </a>
		          <div class="text-center mb-2">
		            <h1 class="mb-2 fs-4"><i class="bi bi-mortarboard-fill"></i>  AcademicGTD</h1>
		            <p class="text-muted fs-5">Receba o link de recuperação</p>
		          </div>
					<div id= "error-message"></div>
		          <form id= "forgotPasswordForm">
		            <div class="mb-4">
		              <input type="email" id="email" class="form-control" placeholder="Insira seu email" required autofocus />
		            </div>

		            <div class="d-grid">
		              <button class="btn btnadd" type="submit">Enviar</button>
		            </div>

		          </form>
		        </div>
		      </div>
		    </div>
        `;

        $('#formContainer').html(forgotFormHtml);
		
		
    });
	
	$(document).on('click', '#backButton', function(e) {
		e.preventDefault();
		$('#formContainer').html(originalLoginForm);
	});
			   
			   
});

$(document).on('submit', '#forgotPasswordForm', function(e) {
	e.preventDefault();
	   $.ajax({
	       type: "POST",
	       url: "/api/password/forgot",
	       contentType: "application/json",
	       data: JSON.stringify({ email: $("#email").val() }),
	       success: function() {
			   $('#formContainer').html(originalLoginForm);
			   $('#error-message').html('<div class="alert alert-success text-dark">Verifique seu email</div>');
	       },
	       error: function() {
	           $('#error-message').html('<div class="alert alert-danger text-dark">Erro na requisição</div>');
	       }
	   });
});

$(document).on('submit', '#loginForm', function(e) {
	e.preventDefault();

	const email = $('#email').val();
	const password = $('#password').val();

	$.ajax({
		url: '/auth/login',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ email: email, password: password }),
		xhrFields: {
			withCredentials: true
		},
		success: function() {
			window.location.href = '/pages/dashboard.html';
		},
		error: function() {
			$('#error-message').html('<div class="alert alert-danger text-dark">Email ou senha incorretos. Tente novamente.</div>');

		}
	});
});