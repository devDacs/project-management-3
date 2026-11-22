import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (typeof query !== "string" || !query.trim()) {
    res.status(400).json({ message: "A valid search query is required." });
    return;
  }

  const searchTerm = query.trim();

  try {
    const [tasks, projects, users] = await Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),

      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),

      prisma.user.findMany({
        where: { username: { contains: searchTerm, mode: "insensitive" } },
        select: {
          id: true,
          username: true,
          profilePictureUrl: true,
        },
        take: 10,
      }),
    ]);

    res.json({ success: true, data: { tasks, projects, users } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
