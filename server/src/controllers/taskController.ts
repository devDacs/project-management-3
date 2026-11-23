import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getTasksByProjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    res.status(400).json({
      message: "Invalid project ID",
    });
    return;
  }

  try {
    const data = await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error retrieving tasks: ${message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const data = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error creating a task: ${message}` });
  }
};

export const updateTaskStatusById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid task ID",
    });
    return;
  }

  try {
    const data = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error updating a task: ${message}` });
  }
};

export const getTasksByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({
      message: "Invalid user ID",
    });
    return;
  }

  try {
    const data = await prisma.task.findMany({
      where: {
        OR: [{ authorUserId: userId }, { assignedUserId: userId }],
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${message}` });
  }
};
