$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    $("#token").val(urlParams.get('token'));
});

  $('#savePasswordBtn').on('click', function (e) {
    const password = $('#newPassword').val();
    const confirmPassword = $('#newPasswordConfirm').val();

    if (password !== confirmPassword) {
      e.preventDefault(); 
      $('#error-message').html('<div class="alert alert-danger text-dark">Use a mesma senha nos dois campos</div>');
    }
  });


$('#resetPasswordForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/api/password/reset",
        contentType: "application/json",
        data: JSON.stringify({
            token: $("#token").val(),
            newPassword: $("#newPassword").val()
        }),
        success: function(response) {
            alert(response);
            window.location.href = "/";
        },
        error: function() {
           $('#error-message').html('<div class="alert alert-danger text-dark">Token inválido fornecido</div>');
        }
    });
});