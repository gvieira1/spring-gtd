
import { updateSwitchLabel } from './helpers.js';
import { definirCategoria } from './api/categorias.js';

export function initializeSwitches() {
    $('.form-check-input').each(function() {
        const switchElement = $(this);
        const switchId = switchElement.attr('id');
        const label = $('#switchLabel' + switchId.replace('formSwitch', ''))

        switchElement.change(function() {
            updateSwitchLabel(switchElement, label);
        });

        updateSwitchLabel(switchElement, label);
    });

    $('#formSwitch1, #formSwitch2, #prazomodal').on('change', definirCategoria);
	
}
