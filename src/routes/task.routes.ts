import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validateTaskInput } from "../middlewares/validate-input.middleware";

const router = Router();

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", validateTaskInput, taskController.createTask);
router.put("/:id", validateTaskInput, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
