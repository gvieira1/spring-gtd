
// Atualiza o texto do label com base no estao do switch
export function updateSwitchLabel(switchElement, switchLabel) {
    if ($(switchElement).prop('checked')) {
        $(switchLabel).text("Sim");
    } else {
        $(switchLabel).text("Não");
    }
}

export function formatarCategoriaParaId(categoria) {
    return categoria.trim().replace(/\s+/g, '');
}
