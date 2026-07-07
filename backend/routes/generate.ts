import { Router } from "express";
import { generatePet } from "../controllers/generateController";

const router = Router();

// Route to handle prompt-based AI pet generation
router.post("/", generatePet);

export default router;
