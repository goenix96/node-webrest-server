import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgresql";
import { text } from "stream/consumers";

describe("Todo route test", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const todo1 = { text: "Hola mundo 1" };
  const todo2 = { text: "Hola mundo 2" };

  test("Should return todos api/todos", async () => {
    await prisma.todo.deleteMany();
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });
    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
  });

  test("should return a todo api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test("should return a 404 NOT FOUND api/todos/:id", async () => {
    const { body } = await request(testServer.app)
      .get(`/api/todos/999`)
      .expect(404);

    expect(body).toEqual({ error: "Todo not found" });
  });

  test("should return a new todo api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test("should return an error if text is not present api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return an error if text is empty api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({ text: "" })
      .expect(400);

    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return an updated todo api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: "Hello world updated", completedAt: "2023-10-21" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "Hello world updated",
      completedAt: "2023-10-21T00:00:00.000Z",
    });
  });

  test("should return 404 if todo is not foun api/todos/:id", async () => {
    const { body } = await request(testServer.app)
      .put(`/api/todos/999`)
      .send({ text: "Hello word updated", completedAt: "2023-10-21" })
      .expect(404);

    expect(body).toEqual({ error: "Todo not found" });
  });

  test("should return an updated todo, text property api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: "Hello world updated" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "Hello world updated",
      completedAt: null,
    });
  });

  test("should return an updated todo, completedAt property api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: "2023-10-21" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: "2023-10-21T00:00:00.000Z",
    });
  });

  test("should delete a todo api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null,
    });
  });

  test("should return 404 if todo is not found api/todos/:id", async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/todos/999`)
      .expect(404);

    expect(body).toEqual({ error: "Todo not found" });
  });
});
