
export function loadSelectOptions() {
    $.get('/gtd-spring/temposEstimados', function(temposEstimados) {
        $('#tempo_estimado').empty();
        temposEstimados.forEach(function(tempoEstimado) {
            $('#tempo_estimado').append(
                `<option value="${tempoEstimado.id}">${tempoEstimado.tempo}</option>`
            );
        });
    }).fail(function() {
        alert("Erro ao carregar tempo estimado.");
    });
}
