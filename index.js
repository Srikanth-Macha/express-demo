const express = require("express");
const mongoose = require("mongoose");

const bodyparser = require("body-parser");
const Todo = require("./models/Todo");

mongoose.connect("mongodb://localhost:6901", () => {
  console.log("Mongoose Connected");
});

const app = express();

app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("This is default route");
});

app.post("/create", async (req, res) => {
  //a new entry which is suitable for the schema
  // is created in the RAM of the server

  //BODY

  if (!req.body.title || !req.body.description)
    res.status(403).json({ error: "bad request" });

  const newTodo = new Todo({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const SavedTodo = await newTodo.save(); //writes to database
    res.json(SavedTodo);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.get("/get-all", async (req, res) => {
  try {
    const todos = await Todo.find(); //select * from table where id="";
    const ResultObj = [];

    todos.forEach((todo) => {
      ResultObj.push({
        title: todo.title,
        description: todo.description,
      });
    });

    res.json(ResultObj);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
}); //90% SIH Backend

app.get("/get-title/:title", async (req, res) => {

  //PARAMETERS

  try {
    const queryResult = await Todo.find({ title: req.params.title });
    res.json(queryResult);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.get("/get-title-desc/:title/:desc", async (req, res) => {
  try {
    const queryResult = await Todo.find({
      title: req.params.title,
      description: req.params.desc,
    }); //o(n^2)
    res.json(queryResult);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.get("/get-id/:id", async (req, res) => {
  try {
    const queryResult = await Todo.findById(req.params.id); //search by primary key (B-Tree indexing)  o(logn)
    res.json(queryResult);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.patch("/update/:id", async (req, res) => {
  //PATCH :- BODY + PARAMS
  try {
    const updated = await Todo.updateOne(
      { "_id": req.params.id },
      {
        $set: {
          title: req.body.title
        }
      }

    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.delete("/delete/:id", async (req, res) => {

  try {
    const updated = await Todo.deleteOne(
      { "_id": req.params.id },
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});


app.listen(process.env.PORT);
