
   $('#login-form').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: '/gtd-spring/login',
			method: 'POST',
			data: {
				email: $('#email').val(),
				senha: $('#senha').val()
			},
			success: function(response) {
				console.log(response);
				if (response.status === 'success') {
					window.location.href = 'pages/dashboard.html';  
				}
			},
			error: function(xhr) {
			    console.log(xhr);
			    if (xhr.responseJSON) {
			        $('#error-message').text(xhr.responseJSON.message).show();
			    } else {
			        $('#error-message').text("Erro desconhecido").show();
			    }
			}

		});
	});