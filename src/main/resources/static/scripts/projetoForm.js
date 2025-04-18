
import { createProjeto } from './api/projetos.js';

$('#projetoForm').submit(function(event) {
    event.preventDefault();

    var projeto = {
        descricao: $('#descricaopro').val(),
    };

    createProjeto(projeto);
});