package com.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Descrição não pode ser vazia")
	@Column(nullable = false)
	private String description;

	private Boolean priority;

	@FutureOrPresent
	private LocalDate deadline;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "estimated_time_id")
	private EstimatedTime estimatedTime;

	private String subject;

	@Column(nullable = false)
	private Boolean done = false;

	private Boolean delegated;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private CategoryEntity category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id")
	private Project project;
	
	@Column(name = "moodle_course_id")
	private Long moodleCourseId;

	@Column(name = "moodle_cmid")
	private Long moodleCmid;
	
	private LocalDateTime completionDate;

	@ManyToMany
	@JoinTable(name = "task_contexts", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "context_id"))
	private List<Context> contexts = new ArrayList<>();

	

}
