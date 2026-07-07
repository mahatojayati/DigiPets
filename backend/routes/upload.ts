import { Router } from "express";
import { uploadPetImage } from "../controllers/uploadController";
import { upload } from "../middleware/uploadValidation";

const router = Router();

// Route to handle transparent PNG file upload
router.post("/", upload.single("file"), uploadPetImage);

export default router;
