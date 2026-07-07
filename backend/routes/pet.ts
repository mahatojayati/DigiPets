import { Router } from "express";
import { getPetMetadata } from "../controllers/petController";

const router = Router();

// Route to fetch metadata for a specific companion pet
router.get("/:id", getPetMetadata);

export default router;
