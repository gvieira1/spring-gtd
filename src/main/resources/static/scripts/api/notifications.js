
import { formatDateFromIso } from '/scripts/helpers.js';
let selectedNotificationDays = null;

export function initNotificationSettings() {

	loadModal();
    bindDropdownClick();
    bindSwitchToggle();
    bindSaveButton();
    toggleNotificationUI($('#notSwitch1').is(':checked'));
}

function bindDropdownClick() {
    $('#notificationDaysOptions .dropdown-item').click(function(e) {
        e.preventDefault();

        if (!isNotificationsEnabled()) return;

        selectedNotificationDays = $(this).data('value');
        updateNotificationButtonText();
    });
}

function bindSwitchToggle() {
    $('#notSwitch1').change(function() {
        const enabled = $(this).is(':checked');
        toggleNotificationUI(enabled);
        updateNotificationButtonText();
    });
}

function toggleNotificationUI(enabled) {
    $('.btn-notif').prop('disabled', !enabled);

    if (!enabled) {
        $('.btn-notif').text('Notificações desativadas');
    } else {
        updateNotificationButtonText();
    }
}

function updateNotificationButtonText() {
    if (!isNotificationsEnabled()) return;

    if (selectedNotificationDays === null) {
        $('.btn-notif').text('Me notifique...');
    } else {
        $('.btn-notif').text(`Me notifique ${selectedNotificationDays} dia(s) antes`);
    }
}

function isNotificationsEnabled() {
    return $('#notSwitch1').is(':checked');
}

function bindSaveButton() {
    $('#saveNotificationSettings').click(function() {
        if (isNotificationsEnabled()) {
            if (selectedNotificationDays === null) {
                showNewNotificationToast(`Selecione um período para ser notificado`);	 
            } else {
                saveNotificationSettings(selectedNotificationDays);
            }
        } else {
			saveNotificationSettings(null);
        }
    });
}

function saveNotificationSettings(daysBefore) {
    console.log("Enviando: Notificações ativadas para " + daysBefore + " dia(s) antes.");
	$.ajax({
	        url: '/api/user/notification-preference',
	        method: 'POST',
	        contentType: 'application/json',
	        data: JSON.stringify({ notificationDaysBeforeDefault: daysBefore }),
	        success: function() {
	            showNewNotificationToast(`Suas preferências de notificação foram salvas!`);	
	            $('#configNotifications').modal('hide');
	        },
	        error: function() {
	            showNewNotificationToast(`Erro ao salvar preferências`);	
	        }
	    });
}

function loadModal(){
	$('#configNotifications').on('shown.bs.modal', function() {
	    loadNotificationPreference();
	});

}

function loadNotificationPreference() {
    $.get('/api/user/notification-preference', function(preference) {
        const daysBefore = preference.notificationDaysBeforeDefault;

        if (daysBefore != null) {
            $('#notSwitch1').prop('checked', true);

            selectedNotificationDays = daysBefore;

            $('.btn-notif').prop('disabled', false).text(`Me notifique ${daysBefore} dia(s) antes`);
        } else {
            $('#notSwitch1').prop('checked', false);
            $('.btn-notif').prop('disabled', true).text('Notificações desativadas');

            selectedNotificationDays = null;
        }
    }).fail(function() {
        showNewNotificationToast(`Erro ao carregar preferências`);	
    });
}

function showNewNotificationToast(message = "Notificação alterada!") {
  const toastEl = document.getElementById('categoryToast');
  const toastBody = document.getElementById('categoryToastBody');

  toastBody.innerHTML = `<i class="bi bi-app-indicator me-2 fs-4"></i> ${message}`;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function showUpcomingTaskNotificationToast(message) {
    const toastId = `toast-${Date.now()}`; 

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center bg-light text-dark border-0 fs-6 w-auto px-4 py-3 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body"><i class="bi bi-bell fs-5 ml-3"></i>${message}</div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
        </div>
    `;

    const $container = $('.toast-container');
    $container.append(toastHtml);

    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, {
        autohide: false 
    });

    toast.show();

}

export function checkAndNotifyUpcomingTasks() {
    $.get('/api/notifications', function(tasks) {
        if (!tasks || tasks.length === 0) return;

        tasks.forEach((task, index) => {
         
            setTimeout(() => {
				const formattedDate = formatDateFromIso(task.deadline); 

                const message = ` <strong>${task.description}</strong> vence em <strong>${formattedDate}</strong>`;
                showUpcomingTaskNotificationToast(message);
            }, index * 500); 
        });
    }).fail(function() {
        console.error("Erro ao buscar notificações.");
    });
}


