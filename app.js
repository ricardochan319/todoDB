const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://ricardochan319:UpCZp07rlQWxvkj4@cluster0.eauz6vg.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

// Handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Mongoose models
const Task = mongoose.model("Task", {
  task: String,
  completed: Boolean,
  taskType: String,
});

const WorkTask = mongoose.model("WorkTask", {
  task: String,
  completed: Boolean,
  taskType: String,
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Route for the home page
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    // Your code to handle tasks here

    const options = { weekday: "long", month: "long", day: "numeric" };
    const currentDate = new Date().toLocaleDateString("en-US", options);

    res.render("index", { tasks, currentDate });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Error fetching tasks.");
  }
});

// Route to handle task creation for Today's Tasks
app.post("/addTask", async (req, res) => {
  const taskText = req.body.task;

  try {
    const newTask = new Task({
      task: taskText,
      completed: false,
    });

    const savedTask = await newTask.save();

    // Log the saved task to the console
    console.log("Task saved:", savedTask);

    res.redirect("/");
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Error creating task.");
  }
});

// Route for Work Tasks
app.get("/workTasks", async (req, res) => {
  try {
    const workTasks = await WorkTask.find({}).exec(); // Use the `exec()` method to execute the query

    const options = { weekday: "long", month: "long", day: "numeric" };
    const currentDate = new Date().toLocaleDateString("en-US", options);

    res.render("workTasks", { workTasks, currentDate });
  } catch (err) {
    console.error("Error fetching work tasks:", err);
    res.status(500).send("Error fetching work tasks.");
  }
});

// Route to handle task creation for Work Tasks
app.post("/workTasks", async (req, res) => {
  const taskText = req.body.task;
  const workTask = new WorkTask({ task: taskText, completed: false });

  try {
    const savedTask = await workTask.save();
    console.log("Work Task saved:", savedTask);
    res.redirect("/workTasks");
  } catch (err) {
    console.error("Error creating work task:", err);
    res.status(500).send("Error creating work task.");
  }
});

// Route to handle task deletion for both Today's Tasks and Work's Tasks
app.post("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID in both collections
    const task = await Task.findById(taskId);
    const workTask = await WorkTask.findById(taskId);

    if (task) {
      // It's a non-work task, delete from the Task collection
      await Task.findByIdAndRemove(taskId);
      res.redirect("/");
    } else if (workTask) {
      // It's a work task, delete from the WorkTask collection
      await WorkTask.findByIdAndRemove(taskId);
      res.redirect("/workTasks");
    } else {
      // Task not found
      res.status(404).send("Task not found");
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task.");
  }
});

// Route for custom lists
app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  // You can render a page specific to the custom list or handle operations related to the list.
  // For example, render a page for tasks in the custom list or perform custom list-specific operations.
  // You can query the database based on the customListName.

  // Example: Render a custom list page
  res.render("customList", { listName: customListName });
});

// Start the Express server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
