import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../models/task.model";
import { sendResponse } from "../utils/response";
import { NotFoundError, BadRequestError } from "../errors/AppError";

const tasks: Task[] = [];

export class TaskController {
  /**
   * Get all tasks with optional filtering and pagination
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllTasks = (req: Request, res: Response) => {
    const { status, page = "1", limit = "10" } = req.query;
    let filtered = tasks;

    if (
      status &&
      ["pending", "in-progress", "completed"].includes(status as string)
    ) {
      filtered = filtered.filter((task) => task.status === status);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const start = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(start, start + limitNum);

    sendResponse(res, 200, true, { data: paginated, total: filtered.length });
  };

  /**
   * Get a task by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getTaskById = (req: Request, res: Response) => {
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) throw new NotFoundError("Task not found");
    sendResponse(res, 200, true, task);
  };

  /**
   * Create a new task
   * @param req - Express request object
   * @param res - Express response object
   */
  createTask = (req: Request, res: Response) => {
    const { title, description, status } = req.body;
    if (!title || !status)
      throw new BadRequestError("Title and status are required");

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    sendResponse(res, 201, true, newTask);
  };

  /**
   * Update an existing task by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateTask = (req: Request, res: Response) => {
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) throw new NotFoundError("Task not found");

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    task.updatedAt = new Date();

    sendResponse(res, 200, true, task);
  };

    /**
   * Delete a task by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteTask = (req: Request, res: Response) => {
    const index = tasks.findIndex((t) => t.id === req.params.id);
    if (index === -1) throw new NotFoundError("Task not found");

    tasks.splice(index, 1);
    sendResponse(res, 204, true, { message: "Task deleted" });
  };
}

export const taskController = new TaskController();
