package com.model.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class AutenticaService {

	public static boolean isAuthenticated(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		return session != null && session.getAttribute("usuario_id") != null;
	}

	public static Integer getAuthenticatedUserId(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		if (session != null) {
			return (Integer) session.getAttribute("usuario_id");
		}
		return null;
	}
}
