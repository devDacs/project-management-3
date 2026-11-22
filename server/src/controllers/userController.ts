import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.user.findMany();
    res.json({ success: true, data });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};
