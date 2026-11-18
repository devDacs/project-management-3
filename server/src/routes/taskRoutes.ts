import { Router } from "express";
import {
  createTask,
  getTasksByProjectId,
  updateTaskStatusById,
} from "../controllers/taskController.js";

const router = Router();

router.get("/project/:id", getTasksByProjectId);
router.post("/", createTask);
router.patch("/:id/status", updateTaskStatusById);

export default router;
