
import { defineCategory } from "./api/category.js";

export function updateSwitchLabel(switchElement, switchLabel) {
	if ($(switchElement).prop('checked')) {
		$(switchLabel).text("Sim");
	} else {
		$(switchLabel).text("Não");
	}
}

export function handleButtonState(inputSelector, buttonSelector) {
	$(inputSelector).on('input', function() {
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

export function createCalendar() {
	$('#sandbox-container .input-group.date').datepicker({
		format: "dd/mm/yyyy",
		language: "pt-BR",
		autoclose: true,
		clearBtn: true
	}).on('input change changeDate clearDate', function() {
		defineCategory();
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

export function runPageTransition() {
	if ($('#page-transition').length) {
		$('#page-transition').remove();
	}

	$('body').prepend(`<div id="page-transition" style="
		position: fixed;
		top: 0; left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #8179B3;
		z-index: 9999;
		opacity: 0.6;
		transition: opacity 0.6s ease;
	"></div>`);

	setTimeout(() => {
		$('#page-transition').css('opacity', '0');
		setTimeout(() => {
			$('#page-transition').remove();
		}, 200);
	}, 50);
}


export function validateDeadline(rawValue, errorId) {
    $('#deadlinemodal').removeClass('is-invalid');
    $(`#${errorId}`).addClass('d-none');

    if (!rawValue) {
        return { valid: true, value: null };
    }

    const [day, month, year] = rawValue.split('/');
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(deadlineDate) || deadlineDate < today) {
        $('#deadlinemodal').addClass('is-invalid');
        $(`#${errorId}`).removeClass('d-none');
        return { valid: false };
    }

    return { valid: true, value: formatDateToIso(rawValue) };
}
