import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean = true,
  payload: Record<string, any>
) => {
  res.status(statusCode).json({
    success,
    status: statusCode,
    message: payload?.message,
    ...payload,
  });
};
