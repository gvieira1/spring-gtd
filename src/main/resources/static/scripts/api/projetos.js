/*
export function createProjeto(projeto) {
    $.ajax({
        url: '/gtd-spring/projeto',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(projeto),
        success: function(response) {
            $('#projetoForm')[0].reset();
            $('#AddProjeto').modal('hide');
        },
        error: function(error) {
            alert('Erro ao criar projeto: ' + error.responseText);
        }
    });
}

export function loadProjetos() {
	$.get('/gtd-spring/projeto', function(projetos) {
		console.log(projetos);
		const projetosList = $('#Projeto');
		projetosList.empty();

		projetos.forEach(function(projeto) {
			var projetoItem = $(`
			<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
						    ${projeto.descricao}
		    </li>
						            `)
				.on('click', function(event) {
					if (!$(event.target).is('input[type="checkbox"]')) {
						$('#subTarefaModal').modal('show');
					}
					});
					projetosList.append(projetoItem);
				});

    }).fail(function() {
        alert('Erro ao carregar projetos.');
    });
}
*/