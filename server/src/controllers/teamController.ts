import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { type Team } from "../generated/prisma/client.js";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const data = await Promise.all(
      teams.map(async (team: Team) => {
        const [productOwner, projectManager] = await Promise.all([
          team.productOwnerUserId &&
            prisma.user.findUnique({
              where: { id: team.productOwnerUserId },
              select: { username: true, profilePictureUrl: true },
            }),

          team.projectManagerUserId &&
            prisma.user.findUnique({
              where: { id: team.projectManagerUserId },
              select: { username: true, profilePictureUrl: true },
            }),
        ]);

        return {
          ...team,
          productOwner,
          projectManager,
        };
      }),
    );

    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error retrieving teams: ${message}` });
  }
};
