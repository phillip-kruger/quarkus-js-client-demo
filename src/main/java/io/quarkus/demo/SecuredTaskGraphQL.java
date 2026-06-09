package io.quarkus.demo;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;

import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import io.quarkus.security.identity.SecurityIdentity;

@GraphQLApi
public class SecuredTaskGraphQL {

    @Inject
    TaskService taskService;

    @Inject
    SecurityIdentity identity;

    @Query
    @RolesAllowed("user")
    public List<Task> securedTasks() {
        return taskService.getAllTasks();
    }

    @Mutation
    @RolesAllowed("user")
    public Task securedAddTask(String title) {
        return taskService.addTask(title + " (by " + identity.getPrincipal().getName() + ")");
    }

    @Mutation
    @RolesAllowed("admin")
    public boolean securedDeleteTask(long id) {
        return taskService.deleteTask(id);
    }
}
