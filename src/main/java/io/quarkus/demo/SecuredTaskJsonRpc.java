package io.quarkus.demo;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;

import io.quarkiverse.jsonrpc.api.JsonRPCApi;
import io.quarkus.security.identity.SecurityIdentity;

@JsonRPCApi
@RolesAllowed("user")
public class SecuredTaskJsonRpc {

    @Inject
    TaskService taskService;

    @Inject
    SecurityIdentity identity;

    public List<Task> securedTasks() {
        return taskService.getAllTasks();
    }

    public Task securedAddTask(String title) {
        return taskService.addTask(title + " (by " + identity.getPrincipal().getName() + ")");
    }

    @RolesAllowed("admin")
    public boolean securedDeleteTask(long id) {
        return taskService.deleteTask(id);
    }
}
