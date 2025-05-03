	
	$('#loginForm').on('submit', function (e) {
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
	    success: function () {
	      window.location.href = '/pages/dashboard.html';
	    },
	    error: function (xhr) {
	      alert('Falha no login: ' + xhr.status);
		  console.log(xhr);
		  		    if (xhr.responseJSON) {
		  		        $('#error-message').text(xhr.responseJSON.message).show();
		  		    } else {
		  		        $('#error-message').text("Erro desconhecido").show();
		  		    }
	    }
	  });
	});