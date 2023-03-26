const mongoose = require("mongoose");

const checklistSchema = mongoose.Schema({
  name: { type: String, required: true },
  tasks: [
    {
      type: mongoose.Schema.type.ObjectId,
      ref: "Task",
    },
  ],
});

modulo.export = mongoose.model("Checklist", checklistSchema);
