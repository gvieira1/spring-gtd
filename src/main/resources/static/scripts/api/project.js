
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


export function fetchActiveProjects(){
	$.ajax({
			url: `/api/project`,
			method: 'GET',
			dataType: 'json',
			success: function (response) {
							$('#categoryTitle').text("Projetos Ativos");			
							renderActiveProjects(response.content);		
						},
						error: function() {
						   $('#taskList').html('<div class="alert alert-danger">Erro ao carregar projetos.</div>');
					}
			
		});
}



function renderActiveProjects(projects, containerSelector = '#taskList') {
	const $container = $(containerSelector);
	$container.empty();

	const pendingProjects = projects.filter(project => project.done);

	if (pendingProjects.length === 0) {
		$container.html('<div class="alert alert-light">Sem projetos por enquanto. Aproveite!</div>');
		return;
	}

	pendingProjects.forEach(project => {
		const projectCard = $(`
			<div class="task-card d-flex justify-content-between align-items-center mb-2" 
				data-bs-toggle="modal" data-bs-target="#taskModal" data-id="${project.id}">
				<div>
					 ${project.description}
				</div>
			</div>
		`);

		//projectCard.on('click', function () {
			//const projectId = $(this).data('id');
			//openEditModal(projectId);
		//});

		$container.append(projectCard);
	});

}

