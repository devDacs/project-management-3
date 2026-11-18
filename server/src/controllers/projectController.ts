import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await prisma.project.findMany();
    res.json({ success: true, data });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const data = await prisma.project.create({
      data: { name, description, startDate, endDate },
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};
