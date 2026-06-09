package io.quarkus.demo;

import java.util.List;

import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/api/tasks")
public class TaskResource {

    @Inject
    TaskService taskService;

    @GET
    public List<Task> list() {
        return taskService.getAllTasks();
    }

    @POST
    public Task create(Task task) {
        return taskService.addTask(task.getTitle());
    }

    @PUT
    @Path("/{id}/toggle")
    public boolean toggle(@PathParam("id") long id) {
        return taskService.toggleTask(id);
    }

    @DELETE
    @Path("/{id}")
    public boolean delete(@PathParam("id") long id) {
        return taskService.deleteTask(id);
    }
}
