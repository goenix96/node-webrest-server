import { Router } from "express";
import { envs } from "../src/config/envs";
import { Server } from "../src/presentation/server";

jest.mock("../src/presentation/server");

describe("Should call server with arguments and start", () => {
  test("Should work", async () => {
    await import("../src/app");

    expect(Server).toHaveBeenCalledTimes(1);

    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
