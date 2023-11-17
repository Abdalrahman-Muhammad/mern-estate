import express from "express";
import {
  test,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verfiyToken } from "../utils/verfiyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verfiyToken, updateUser);
router.delete("/delete/:id", verfiyToken, deleteUser);

export default router;
