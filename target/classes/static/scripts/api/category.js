

export function defineCategory() {
	let category = "Arquivo";
	const priority = $('#formSwitch1').prop('checked');
	const delegated = $('#formSwitch2').prop('checked');
	const deadline = $('#deadlinemodal').val();

	if (delegated) {
		category = "Aguardando Resposta";
	} else if (priority ) {
		category = "Quando Puder";
	} else if (deadline) {
		category = "Agendado";
	} 

	attCategorySelect(category);
}

const categoryMap = {
  "Quando Puder": "1",
  "Agendado": "2",
  "Projeto": "3",
  "Aguardando Resposta": "4",
  "Arquivo": "5"
};

function attCategorySelect(categoryName) {
  const categoryId = categoryMap[categoryName];
  $('#categorymodal').val(categoryId).trigger('change');
}

