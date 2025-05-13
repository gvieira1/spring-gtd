package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {
        "/categorias/{path:[^\\.]*}", 
        "/categorias/**",
        "/projetos/**",
        "/calendario",
        "/relatorio"
    })
    public String redirect() {
        return "forward:/pages/home.html";
    }
}