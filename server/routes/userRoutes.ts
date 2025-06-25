import express from "express";
import {login, register, validateStep} from "../controllers/userControllers";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/validate-step",validateStep)

export default router;

