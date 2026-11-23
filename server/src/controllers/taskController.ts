import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getTasksByProjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const data = await prisma.task.findMany({
      where: {
        projectId: Number(id),
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
  const { id } = req.params;
  const { status } = req.body;
  try {
    const data = await prisma.task.update({
      where: {
        id: Number(id),
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
