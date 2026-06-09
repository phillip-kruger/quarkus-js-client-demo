package io.quarkus.demo;

import java.util.List;

import jakarta.inject.Inject;

import io.quarkiverse.jsonrpc.api.JsonRPCApi;

@JsonRPCApi
public class TaskJsonRpc {

    @Inject
    TaskService taskService;

    public List<Task> tasks() {
        return taskService.getAllTasks();
    }

    public Task addTask(String title) {
        return taskService.addTask(title);
    }

    public boolean toggleTask(long id) {
        return taskService.toggleTask(id);
    }

    public boolean deleteTask(long id) {
        return taskService.deleteTask(id);
    }
}
