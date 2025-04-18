package com.utils;

import java.io.IOException;
import java.time.LocalDate;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JsonUtil {

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .create();

    public static void sendJsonResponse(HttpServletResponse resp, Object object) throws IOException {
        sendJsonResponseRaw(resp, gson.toJson(object));
    }

    public static void sendJsonResponse(HttpServletResponse resp, String status, String message) throws IOException {
        String jsonResponse = buildJsonResponse(status, message);
        sendJsonResponseRaw(resp, jsonResponse);
    }

    // status 201 (Created)
    public static void sendJsonResponseCreated(HttpServletResponse resp, String status, String message) throws IOException {
        sendJsonResponse(resp, status, message);
        resp.setStatus(HttpServletResponse.SC_CREATED);
    }

    // status 401 (Unauthorized)
    public static void sendJsonResponseUnauthorized(HttpServletResponse resp, String status, String message) throws IOException {
        sendJsonResponse(resp, status, message);
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    public static void sendJsonResponseNotFound(HttpServletResponse resp, String status, String message) throws IOException {
        sendJsonResponse(resp, status, message);
        resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
    }

    //  400 (Bad Request)
    public static void sendJsonResponseBadRequest(HttpServletResponse resp, String status, String message) throws IOException {
        sendJsonResponse(resp, status, message);
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }

    private static String buildJsonResponse(String status, String message) {
        return String.format("{\"status\": \"%s\", \"message\": \"%s\"}", status, message);
    }

    private static void sendJsonResponseRaw(HttpServletResponse resp, String jsonResponse) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(jsonResponse);
    }

    public static Gson getGson() {
        return gson;
    }
}
