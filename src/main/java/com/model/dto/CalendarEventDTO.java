package com.model.dto;

import lombok.Data;

@Data
public class CalendarEventDTO {
    private String id;
    private String calendarId;
    private String title;
    private String category;
    private String start;
    private String end;
}
