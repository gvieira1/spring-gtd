
import { defineCategory } from "./api/categorias.js";

export function updateSwitchLabel(switchElement, switchLabel) {
    if ($(switchElement).prop('checked')) {
        $(switchLabel).text("Sim");
    } else {
        $(switchLabel).text("Não");
    }
}

export function handleButtonState(inputSelector, buttonSelector) {
  $(inputSelector).on('input', function () {
    const isEmpty = $(this).val().trim() === '';
    $(buttonSelector).prop('disabled', isEmpty);
  });
}


export function getCurrentCategoryFromURL() {
	const pathToCategory = {
		'caixa-de-entrada': 'Caixa de Entrada',
		'quando-puder': 'Quando Puder',
		'agendado': 'Agendado',
		'aguardando-resposta': 'Aguardando Resposta',
		'arquivo': 'Arquivo'
	};

  const currentPath = location.pathname;
  const extractedCategory = currentPath.split('/').pop();

  if (currentPath.includes("/categorias/")) {
    return pathToCategory[extractedCategory] || decodeURIComponent(extractedCategory);
  } 

  return null;
}

export function createCalendar(){
	$('#sandbox-container .input-group.date').datepicker({
	    format: "dd/mm/yyyy",
		language: "pt-BR",
		autoclose: true,
		clearBtn: true
	});
	
	$('#sandbox-container').on('input change', function () {
			setTimeout(() => {
				defineCategory();
			}, 0);
		});

}

export function formatDateFromIso(isoDateStr) {
    const [year, month, day] = isoDateStr.split('-');
    return `${day}/${month}/${year}`;
}

export function formatDateToIso(brDateStr) {
	const [day, month, year] = brDateStr.split('/');
	return `${year}-${month}-${day}`;
}



