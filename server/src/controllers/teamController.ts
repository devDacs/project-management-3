import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.team.findMany({
      include: {
        teamProductOwner: {
          select: {
            username: true,
            profilePictureUrl: true,
          },
        },
        teamProjectManager: {
          select: {
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error retrieving teams: ${message}` });
  }
};
