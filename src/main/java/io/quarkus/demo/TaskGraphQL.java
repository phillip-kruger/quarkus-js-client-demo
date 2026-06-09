package io.quarkus.demo;

import java.util.List;

import jakarta.inject.Inject;

import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
public class TaskGraphQL {

    @Inject
    TaskService taskService;

    @Query
    public List<Task> tasks() {
        return taskService.getAllTasks();
    }

    @Mutation
    public Task addTask(String title) {
        return taskService.addTask(title);
    }

    @Mutation
    public boolean toggleTask(long id) {
        return taskService.toggleTask(id);
    }

    @Mutation
    public boolean deleteTask(long id) {
        return taskService.deleteTask(id);
    }
}
