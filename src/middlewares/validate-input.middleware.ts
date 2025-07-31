import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/AppError";
import { TaskStatus } from "../models/task.model";

const allowedStatus: TaskStatus[] = ["pending", "in-progress", "completed"];

export function validateTaskInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, status, description } = req.body;

  if (typeof title !== "string" || !title.trim())
    throw new BadRequestError(
      "Title is required and must be a non-empty string"
    );

  if (
    typeof status !== "string" ||
    !allowedStatus.includes(status as TaskStatus)
  )
    throw new BadRequestError(
      `Status is required and must be one of: ${allowedStatus.join(", ")}`
    );

  if (description !== undefined && typeof description !== "string")
    throw new BadRequestError("Description must be a string if provided");

  next();
}
