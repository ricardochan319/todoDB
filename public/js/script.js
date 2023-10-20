function toggleTaskCompletion(taskId, index) {
  // Send an HTTP request to mark the task as completed on the server
  fetch(`/complete/${taskId}`, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        // Update the class to apply a line-through style
        const taskElement = document.querySelector(
          `li:nth-child(${index + 1})`
        );
        taskElement.classList.toggle("completed");
      } else if (response.status === 404) {
        console.error("Task not found"); // Add a more specific error message
      } else {
        console.error("Error marking task as completed:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Get all checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", async (event) => {
    const taskId = event.target.getAttribute("data-task-id");

    // Make an AJAX request to delete the task
    try {
      const response = await fetch(`/deleteTask/${taskId}`, {
        method: "POST",
      });

      if (response.ok) {
        // Task deleted, you can update the UI or perform other actions
        // Remove the task from the DOM
        event.target.parentElement.remove();
      } else if (response.status === 404) {
        console.error("Task not found"); // Add a more specific error message
      } else {
        console.error("Error deleting task:", response.status);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  });
});
