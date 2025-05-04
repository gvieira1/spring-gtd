package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {
        "/categorias/{path:[^\\.]*}", 
        "/categorias/**",
        "/projetos/**"
    })
    public String redirect() {
        return "forward:/pages/dashboard.html";
    }
}