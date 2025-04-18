

import { loadSelectOptions } from './api/temposEstimados.js';
import { loadTarefas } from './api/tarefas.js';
import { loadCategorias } from './api/categorias.js';
import { initializeSwitches } from './modal.js';
import { loadProjetos } from './api/projetos.js';

// Inicialização do aplicativo
$(document).ready(function() {
    loadSelectOptions();
    loadTarefas();
	loadProjetos()
    loadCategorias();
	initializeSwitches();
});
