require("dotenv").config();
const express = require("express"),
  app = express(),
  cors = require("cors"),
  PORT = process.env.PORT || 3001,
  Task = require("./task");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static("build"));

// get all tasks
app.get("/api/tasks", (req, res) => {
  Task.find({}).then((tasks) => {
    res.json(tasks);
  });
});

// get a single task
app.get("/api/tasks/:id", (req, res) => {
  Task.findById(req.params.id).then((task) => {
    res.json(task);
    console.log(task);
  });
});

// delete all tasks
app.delete("/api/tasks", (req, res) => {
  Task.deleteMany({}).then((result) => {
    console.log(result);
    res.status(204).end();
  });
});

// delete a single task
app.delete("/api/tasks/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id).then((result) => {
    console.log(result);
    res.status(204).end();
  });
});

// add a new task
app.post("/api/tasks", (req, res) => {
  const body = req.body;

  if (!body.title || !body) {
    return res.status(400).json({
      error: "Missing information",
    });
  }

  const task = new Task({
    title: body.title,
    priority: body.priority,
    date: body.date,
  });

  task.save().then((savedTask) => {
    console.log("A new task has been added: ", savedTask);
    res.json(savedTask);
  });
});

// update a task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id),
    body = req.body;

  if (!body.title || !body) {
    return res.status(400).json({
      error: "Missing information",
    });
  }

  const task = {
    title: body.title,
    priority: body.priority,
    date: body.date,
  };

  Task.findOne({ id: id }).then((foundTask) => {
    foundTask.title = task.title;
    foundTask.priority = task.priority;
    foundTask.date = task.date;

    foundTask.save().then((updatedTask) => {
      console.log("A task has been updated: ", updatedTask);
      res.json(updatedTask);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
