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
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};
