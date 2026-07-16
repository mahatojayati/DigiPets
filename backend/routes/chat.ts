import { Router } from "express";
import { chatWithCompanion } from "../controllers/chatController";

const router = Router();

// Route to handle dynamic AI companion chat dialogue
router.post("/", chatWithCompanion);

export default router;
