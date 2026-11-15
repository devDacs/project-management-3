import { Request, Response } from "express";
import prisma from "../lib/prisma";

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
