const express = require("express");
const checklist = require("../models/checklist");

const checklistDepedentRouter = express.Router();
const simpleRouter = express.Router();

const Checklist = require("../models/checklist");
const task = require("../models/task");
const Task = require("../models/task");

checklistDepedentRouter.get("/:id/tasks/new", async (req, res) => {
  try {
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { errors: "Erro ao carregar o formulário" });
  }
});

simpleRouter.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    let checklist = await Checklist.findById(task.checklist);
    let taskToRemove = checklist.tasks.indexOf(task._id);
    checklist.tasks.slice(taskToRemove, 1);
    checklist.save();
    res.redirect(`checklists/${checklist._id}`);
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { errors: "Erro ao remover um tarefa" });
  }
});

checklistDepedentRouter.post("/:id/tasks", async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, checklist: req.params.id });

  try {
    await task.save();
    let checklist = await Checklist.findById(req.params.id);
    checklist.tasks.push(task);
    await checklist.save();
    res.redirect(`/checklists/${req.params.id}`);
  } catch (error) {
    let errors = error.errors;
    res.status(422).render("tasks/new", {
      task: { ...task, errors },
      checklistId: req.params.id,
    });
  }
});

module.exports = {
  checklistDepedent: checklistDepedentRouter,
  simple: simpleRouter,
};
