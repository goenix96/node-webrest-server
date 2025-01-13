import { Request, Response } from "express";
import { prisma } from "../../data/postgresql";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

const todos = [
  { id: 1, text: "Todo 1", completedAt: new Date() },
  { id: 2, text: "Todo 2", completedAt: null },
  { id: 3, text: "Todo 3", completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany({});
    res.json(todos);
  };

  getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: `ID argument is not a number` });
      return;
    }

    const todo = await prisma.todo.findMany({
      where: {
        id,
      },
    });

    todo ? res.json(todo) : res.status(404).json({ error: `Todo not found` });
  };

  createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    res.json(todo);
  };

  updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const todo = await prisma.todo.findFirst({
      where: { id },
    });

    if (!todo) {
      res.status(400).json({ error: `Todo not found` });
      return;
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: updateTodoDto!.values,
    });

    res.json(updatedTodo);
  };

  deleteTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: `ID argument is not a number` });
      return;
    }

    const todo = await prisma.todo.findFirst({
      where: { id },
    });

    if (!todo) {
      res.status(400).json({ error: `Todo not found` });
      return;
    }

    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    res.json(deletedTodo);
  };
}
