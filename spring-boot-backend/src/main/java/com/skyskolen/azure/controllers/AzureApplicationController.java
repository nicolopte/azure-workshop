package com.skyskolen.azure.controllers;

import com.skyskolen.azure.model.Greeting;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/azure-service")
@CrossOrigin("*")
public class AzureApplicationController {

    @GetMapping("/greeting")
    public Greeting greetingMessage() {
        return new Greeting("Hola from backend :)");
    }
}
