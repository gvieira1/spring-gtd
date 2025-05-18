

export function loadSelectOptions(selectedId = null) {
    $.get('/api/estimated-times', function(estimatedTimes) {
        const $select = $('#estimated_time');
        $select.empty();

        estimatedTimes.forEach(function(estimated) {
            const selectedAttr = (estimated.id === selectedId) ? 'selected' : '';
            $select.append(
                `<option value="${estimated.id}" ${selectedAttr}>${estimated.time}</option>`
            );
        });
    }).fail(function() {
        alert("Erro ao carregar tempo estimado.");
    });
}
