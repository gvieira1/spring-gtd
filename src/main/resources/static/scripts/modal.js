
import { updateSwitchLabel } from './helpers.js';
import { defineCategory } from './api/category.js';

export function initializeSwitches() {
    $('.form-check-input').each(function () {
        const switchElement = $(this);
        const switchId = switchElement.attr('id');
        const label = $('#switchLabel' + switchId.replace('formSwitch', ''));

        switchElement.on('change', function () {
            updateSwitchLabel(switchElement, label);
        });
    });

    $('#formSwitch1, #formSwitch2, #deadlinemodal').on('change', defineCategory);
}
