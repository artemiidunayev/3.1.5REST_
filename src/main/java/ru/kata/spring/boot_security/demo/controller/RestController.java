package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@org.springframework.web.bind.annotation.RestController
@RequestMapping({"/admin"})
public class RestController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public RestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional> getUserById(@PathVariable("id") long id){
        Optional<User> user = userService.findUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping
    public List<User> showAllUsers() {
        return  userService.getAllUsers();
    }

    @PutMapping({"/{id}"})
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user, @PathVariable("id") Long id) {
        if(!user.getRoles().isEmpty()) {
            long idRole = new ArrayList<>(user.getRoles()).get(0).getId();

            if (idRole == 2) {
                user.setRoles(Collections.singleton(roleService.getRole(1L)));
            } else if (idRole == 1){
                user.setRoles(Collections.singleton(roleService.getRole(2L)));
            }else {
                user.setRoles(roleService.getListRoles());
            }
        }
        this.userService.updateUser(id, user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<HttpStatus> create(@RequestBody User user) {
        this.userService.saveUser(user);
return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
        this.userService.delete(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
