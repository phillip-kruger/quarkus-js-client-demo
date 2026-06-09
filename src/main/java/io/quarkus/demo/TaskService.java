package io.quarkus.demo;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TaskService {

    private final AtomicLong idCounter = new AtomicLong(1);
    private final List<Task> tasks = new CopyOnWriteArrayList<>();

    public TaskService() {
        addTask("Learn Quarkus");
        addTask("Build a demo app");
        addTask("Try JS clients");
    }

    public List<Task> getAllTasks() {
        return List.copyOf(tasks);
    }

    public Task addTask(String title) {
        Task task = new Task(idCounter.getAndIncrement(), title);
        tasks.add(task);
        return task;
    }

    public boolean toggleTask(long id) {
        for (Task task : tasks) {
            if (task.getId() == id) {
                task.setCompleted(!task.isCompleted());
                return true;
            }
        }
        return false;
    }

    public boolean deleteTask(long id) {
        return tasks.removeIf(t -> t.getId() == id);
    }
}
