
export function createProject(text) {
	$.ajax({
		url: '/api/project',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ description: text }),
		success: function() {
			console.log('Projeto criado');
		},
		error: function() {
			alert('Erro ao criar projeto');
		}
	}).always(function() {
		$('#taskOrProjectModal').modal('hide');
		$('#newAction').val('');
	});

}

