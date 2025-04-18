package com.model.validation;

import java.util.List;

import com.model.entity.Task;

public class TarefaValidator {

	public static boolean isTarefaValid(Task tarefa) {
		return tarefa != null;
	}

	public static boolean isTarefaValid(List<Task> tarefa) {
		return tarefa != null && !tarefa.isEmpty();
	}

	public static boolean isPathValid(String string) {
		return string != null && string.length() > 1;
	}

}
