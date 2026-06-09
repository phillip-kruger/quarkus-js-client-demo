package io.quarkus.demo;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

import io.quarkus.security.identity.SecurityIdentity;

@Path("/api/secured/tasks")
@RolesAllowed("user")
public class SecuredTaskResource {

    @Inject
    TaskService taskService;

    @Inject
    SecurityIdentity identity;

    @GET
    public List<Task> list() {
        return taskService.getAllTasks();
    }

    @POST
    public Task create(Task task) {
        return taskService.addTask(task.getTitle() + " (by " + identity.getPrincipal().getName() + ")");
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    public boolean delete(@PathParam("id") long id) {
        return taskService.deleteTask(id);
    }
}
