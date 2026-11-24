import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.user.findMany();
    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error retrieving users: ${message}` });
  }
};

export const getUserByCognitoId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cognitoId = req.params.id;

  if (typeof cognitoId !== "string") {
    res.status(400).json({
      message: "Invalid Cognito ID",
    });
    return;
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        cognitoId,
      },
    });

    res.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error retrieving a user: ${message}` });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    username,
    cognitoId,
    profilePictureUrl = "i1.jpg",
    teamId = 1,
  } = req.body;
  try {
    const data = await prisma.user.create({
      data: {
        username,
        cognitoId,
        profilePictureUrl,
        teamId,
      },
    });

    res
      .status(201)
      .json({ success: true, data, message: "User Created Successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({ message: `Error creating a user: ${message}` });
  }
};
