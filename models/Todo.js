const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type:String
  },
});

module.exports = mongoose.model('Todo',TodoSchema,'todo-custom');
