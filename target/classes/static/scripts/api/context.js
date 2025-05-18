

export function configureContextSelect2(selector, dropdownParent = null, placeholder = null) {
	$(selector).select2({
		language: {
			noResults: () => "Nenhum contexto encontrado",
			inputTooShort: () => "Digite 1 ou mais caracteres",
			searching: () => "Buscando..."
		},
		dropdownParent: dropdownParent ? $(dropdownParent) : null,
		placeholder: placeholder || null,
		ajax: {
			url: '/api/contexts/select',
			dataType: 'json',
			delay: 250,
			data: params => ({
				term: params.term || ''
			}),
			processResults: data => ({
				results: data
			}),
			cache: true
		},
		minimumInputLength: 0,
		width: '100%',
		containerCssClass: "select2-custom-container",
		dropdownCssClass: "select2-custom-dropdown"
	});
}

