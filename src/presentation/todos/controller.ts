import { Request, Response } from "express";

const todos = [
  { id: 1, text: "Todo 1", completedAt: new Date() },
  { id: 2, text: "Todo 2", completedAt: null },
  { id: 3, text: "Todo 3", completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  getTodos = (req: Request, res: Response) => {
    res.json(todos);
  };

  getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: `ID argument is not a number` });
      return;
    }

    const todo = todos.find((todo) => todo.id === id);

    todo ? res.json(todo) : res.status(404).json({ error: `Todo not found` });
  };

  createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: `Text property is required` });
    }

    const newTodo = {
      id: todos.length + 1,
      text,
      completedAt: new Date(),
    };
    todos.push(newTodo);

    res.json(newTodo);
  };

  updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: `ID argument is not a number` });
      return;
    }

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      res.status(400).json({ error: `Todo not found` });
      return;
    }

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;

    completedAt === "null"
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo?.completedAt));

    res.json(todo);
  };

  deleteTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: `ID argument is not a number` });
      return;
    }

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      res.status(404).json({ error: `Todo not found` });
      return;
    }

    todos.splice(todos.indexOf(todo), 1);

    res.json(todo);
  };
}
