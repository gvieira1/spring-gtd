package com.integration;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.config.TestConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.dto.GroupedTasksResponseDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.dto.WeeklyReportDTO;
import com.model.entity.User;
import com.model.service.TaskService;
import com.model.service.UserService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
class TaskControllerItTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TaskService taskService;

	@Autowired
	private UserService userService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void testGetFilteredTasks() throws Exception {
		User mockUser = new User();
		mockUser.setName("John");
		mockUser.setPassword("123");
		mockUser.setEmail("john@123.com");

		when(userService.getAuthenticatedUser()).thenReturn(mockUser);

		TaskResponseDTO task1 = new TaskResponseDTO();
		task1.setId(1L);
		task1.setDescription("First task");

		TaskResponseDTO task2 = new TaskResponseDTO();
		task2.setId(2L);
		task2.setDescription("Second task");

		Page<TaskResponseDTO> page = new PageImpl<>(List.of(task1, task2));

		when(taskService.getFilteredTasks(null, null, PageRequest.of(0, 20))).thenReturn(page);

		mockMvc.perform(get("/api/tasks").param("page", "0").param("size", "20").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andExpect(jsonPath("$.content").isArray())
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.content[0].description").value("First task"))
				.andExpect(jsonPath("$.content[1].description").value("Second task"));
	}

	@Test
	void shouldReturnTask_whenGetTaskByIdCalled() throws Exception {
		TaskResponseDTO taskResponse = new TaskResponseDTO();
		taskResponse.setId(1L);

		Mockito.when(taskService.getTaskById(1L)).thenReturn(taskResponse);

		mockMvc.perform(get("/api/tasks/1")
				.contentType(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk());
	}

	@Test
	void shouldReturnGroupedTasks_whenGetGroupedTasksCalled() throws Exception {
		GroupedTasksResponseDTO responseDTO = new GroupedTasksResponseDTO();
		responseDTO.setTasksByCategory(new HashMap<>());

		Mockito.when(taskService.getTasksGroupedByCategory(Mockito.any())).thenReturn(responseDTO);

		mockMvc.perform(get("/api/tasks/grouped")
				.contentType(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk());
	}

	@Test
	void testGetWeeklyReport() throws Exception {

		User mockUser = new User();
		mockUser.setName("John");
		mockUser.setPassword("123");
		mockUser.setEmail("john@123.com");

		when(userService.getAuthenticatedUser()).thenReturn(mockUser);

		WeeklyReportDTO fakeReport = new WeeklyReportDTO(10, // totalTasks
				1.43, // dailyAverage
				Map.of("Math", 5L, "History", 5L), // tasksBySubject
				Map.of(true, 6L, false, 4L), // tasksByPriority
				Map.of("1h", 7L, "2h", 3L), // tasksByEstimatedTime
				Map.of("2025-04-21", 3L, "2025-04-22", 7L) // tasksCompletedByDay
		);

		when(taskService.generateWeeklyReport(mockUser)).thenReturn(fakeReport);

		mockMvc.perform(get("/api/tasks/weekly-report").accept("application/json")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser
	void shouldCreateTask_whenPostTaskCalled() throws Exception {
		TaskRequestDTO requestDTO = new TaskRequestDTO();
		requestDTO.setDescription("Nova tarefa");

		TaskResponseDTO responseDTO = new TaskResponseDTO();
		responseDTO.setId(1L);

		Mockito.when(taskService.save(Mockito.any())).thenReturn(responseDTO);

		mockMvc.perform(post("/api/tasks")
				.content(objectMapper.writeValueAsString(requestDTO))
				.contentType(MediaType.APPLICATION_JSON))
		.andExpect(status().isCreated());
	}

	@Test
	@WithMockUser
	void shouldUpdateTask_whenPutTaskCalled() throws Exception {
		TaskRequestDTO updatedDTO = new TaskRequestDTO();
		updatedDTO.setDescription("Atualizada");

		TaskResponseDTO responseDTO = new TaskResponseDTO();
		responseDTO.setId(1L);

		Mockito.when(taskService.updateTask(Mockito.eq(1L), Mockito.any())).thenReturn(responseDTO);

		mockMvc.perform(put("/api/tasks/1")
				.content(objectMapper.writeValueAsString(updatedDTO))
				.contentType(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk());
	}

	@Test
	@WithMockUser
	void shouldRemoveProjectFromTask_whenPatchRemoveProjectCalled() throws Exception {
		TaskResponseDTO responseDTO = new TaskResponseDTO();
		responseDTO.setId(1L);

		Mockito.when(taskService.removeProjectFromTask(1L)).thenReturn(responseDTO);

		mockMvc.perform(patch("/api/tasks/1/remove-project")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	@WithMockUser
	void shouldMarkTaskAsComplete_whenPatchCompleteCalled() throws Exception {
		TaskResponseDTO responseDTO = new TaskResponseDTO();
		responseDTO.setId(1L);

		Mockito.when(taskService.markAsCompleted(1L)).thenReturn(responseDTO);

		mockMvc.perform(patch("/api/tasks/1/complete").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	@WithMockUser
	void shouldDeleteTask_whenDeleteTaskCalled() throws Exception {
		Mockito.doNothing().when(taskService).deleteTask(1L);

		mockMvc.perform(delete("/api/tasks/1").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());
	}
}
