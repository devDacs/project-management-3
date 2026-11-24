import { Router } from "express";
import {
  createUser,
  getUserByCognitoId,
  getUsers,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/cognitoId/:id", getUserByCognitoId);

export default router;
