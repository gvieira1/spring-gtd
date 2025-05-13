	
let originalLoginForm = null;

$(document).ready(function() {
	
	if (!originalLoginForm) {
	      originalLoginForm = $('#formContainer').html();
	 }

	$(document).on('click', '#forgotBtn', function(e) {
        e.preventDefault();
		     
		const forgotFormHtml = `
		<a id="backButton" class="text-decoration-none text-dark mb-4"><i class="bi bi-arrow-left fs-4"></i></a>
				  <h3 class="text-center fw-bold mb-4 mt-4">Receba o link de recuperação</h3>
			

							      <div id= "error-message"></div>
							        <form   id= "forgotPasswordForm" >
							          <div class="form-group ">
							            <i class="bi bi-envelope-fill"></i>
							            <input type="email" class="form-control mt-6" placeholder="Seu email cadastrado" required autofocus>
							          </div>
							          <br>
							          <div class="d-grid mb-4">
							            <button type="submit" class="btn btn-custom btnadd">Enviar para o email</button>
							          </div>
							         </form>
		      `;

			  $('#formContainer').slideUp(300, function () {
			    $(this).html(forgotFormHtml).slideDown(300);
			  });	
		
    });
	
	$(document).on('click', '#signupBtn', function(e) {
	    e.preventDefault();
		     
		const signupFormHtml = `
		<a id="backButton" class="text-decoration-none text-dark"><i class="bi bi-arrow-left fs-4"></i></a>
		       <h3 class="text-center fw-bold ">Crie sua conta</h3>
		       <p class="text-center text-muted mb-4">com email e senha</p>
			   <div id= "error-message"></div>
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
		           <button type="submit" class="btn btn-custom" id="btnSignup" >Cadastre-se</button>
		         </div>
		       </form>
		      `;

			  $('#formContainer').slideUp(300, function () {
			    $(this).html(signupFormHtml).slideDown(300);
			  });	
		
	});

	$(document).on('click', '#backButton', function(e) {
	  e.preventDefault();
	  $('#formContainer').slideUp(300, function () {
	    $(this).html(originalLoginForm).slideDown(300);
	  });
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
			setTimeout(function() {
			       $('body').append('<div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #8179B3; z-index: 9999; opacity: 0.6; transition: opacity 0.6s ease;" id="out-transition"></div>');
			       $('#out-transition').css('opacity', '1');

			       setTimeout(function() {
			           window.location.href = '/pages/home.html';
			       }, 400);
			   }, 600);	
		},
		error: function() {
			$('#error-message').html('<div class="alert alert-danger text-dark">Email ou senha incorretos. Tente novamente.</div>');

		}
	});
});

$(document).on('click', '#btnSignup', function(e) {
   const password = $('#passwordsignup1').val();
   const confirmPassword = $('#passwordsignup2').val();

   if (password !== confirmPassword) {
     e.preventDefault(); 
     $('#error-message').html('<div class="alert alert-danger text-dark">Use a mesma senha nos dois campos</div>');
   }
 });

$(document).on('submit', '#signupForm', function(e) {
	e.preventDefault();

	const email = $('#emailsignup').val();
	const password = $('#passwordsignup1').val();
	const name = $('#name').val();

	$.ajax({
		url: '/auth/register',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ name: name, email: email, password: password }),
		success: function() {
		    $('#formContainer').slideUp(300, function () {
		        $(this).html(originalLoginForm).slideDown(300, function() {
		            $('#error-message').html('<div class="alert alert-success text-dark">Conta criada! Inicie sua sessão</div>');
		        });
		    });
		},
		error: function() {
			$('#error-message').html('<div class="alert alert-danger text-dark">Erro no envio. Tente novamente mais tarde.</div>');

		}
	});
});